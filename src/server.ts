import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());
app.use(cookieParser());

// Configure session middleware
app.use(
  session({
    secret:
      process.env['SESSION_SECRET'] || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env['NODE_ENV'] === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);

const serviceMap: { prefix: string; baseUrl: string }[] = [
  { prefix: '/api/user', baseUrl: 'http://localhost:5294' },
  { prefix: '/api/product', baseUrl: 'http://localhost:5124' },
];

/**
 * Login route: proxy credentials to identity microservice and store token in session
 * Client posts credentials to /api/user/login. The backend response is forwarded
 * but the access token is stored in the server session.
 */
app.post('/api/user/login', async (req, res, next) => {
  try {
    console.log('Login attempt for user:', req.body?.email);
    const identityUrl = 'http://localhost:5294/api/user/login';
    const resp = await fetch(identityUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!resp.ok) {
      const errorData = await resp.text();
      res.status(resp.status).json(errorData);
      return;
    }

    const data = await resp.json();

    // Store token in session instead of cookie
    (req.session as any).accessToken = data.accessToken;
    (req.session as any).authenticated = true;

    res.status(resp.status).json({
      authenticated: data.authenticated ?? true,
      message: data.message ?? 'ok',
    });
    return;
  } catch (error) {
    next(error);
  }
});

/**
 * Token validation helper
 */
const validateToken = async (token: string): Promise<boolean> => {
  try {
    const validateUrl = 'http://localhost:5294/api/user/validate';
    const resp = await fetch(validateUrl, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    });
    return resp.ok;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};

/**
 * Check authentication status endpoint
 */
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = (req.session as any)?.accessToken;

    if (!token) {
      res.status(401).json({ authenticated: false, message: 'No token' });
      return;
    }

    // Validate token with identity service
    // const isValid = await validateToken(token);
    const isValid = (req.session as any).authenticated;
    if (!isValid) {
      // Clear invalid session
      (req.session as any).accessToken = null;
      (req.session as any).authenticated = false;
      res.status(401).json({ authenticated: false, message: 'Invalid Token' });
      return;
    }

    res.json({ authenticated: true });
  } catch (error) {
    res.status(500).json({ authenticated: false, message: 'Server error' });
  }
});

/**
 * Logout endpoint
 */
app.post('/api/auth/logout', (req, res) => {
  (req.session as any).accessToken = null;
  (req.session as any).authenticated = false;
  res.json({ message: 'Logged out successfully' });
});

app.post('/api/user', async (req, res, next) => {
  try {
    const identityUrl = 'http://localhost:5294/api/user';
    const resp = await fetch(identityUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await resp.json();

    res.status(resp.status).json(data);
    return;
  } catch (error) {
    next(error);
  }
});

app.get('/api/product', async (_, res, next) => {
  try {
    const productUrl = 'http://localhost:5124/api/product';
    const resp = await fetch(productUrl, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });
    const data = await resp.json();
    res.status(200).json(data);
    return;
  } catch (error) {
    next(error);
  }
});

const shouldSkipProxy = (url: string): boolean => {
  return (
    url === '/api/user/login' ||
    url === '/api/user' ||
    url.startsWith('/api/auth/')
  );
};

/**
 * Generic proxy for /api/* - finds the matching microservice, forwards request and
 * injects Authorization from session if present.
 */
app.use('/api', async (req, res, next) => {
  try {
    const service =
      serviceMap.find((s) => req.originalUrl.startsWith(s.prefix)) ?? null;

    if (!service) {
      res.status(502).json({
        message: `No backend mapping for request, received ${req.originalUrl}`,
      });
      return;
    }

    const token = (req.session as any)?.accessToken;

    if (token) {
      const isValidToken = (req.session as any).authenticated;
      if (!isValidToken) {
        (req.session as any).accessToken = null;
        (req.session as any).authenticated = false;
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
      }
    }

    const targetUrl = `${service.baseUrl}${req.originalUrl}`;

    // clone headers but avoid host/content-length
    const headers: Record<string, string> = {};
    Object.entries(req.headers).forEach(([k, v]) => {
      if (!v) return;
      if (k === 'host' || k === 'content-length') return;
      headers[k] = Array.isArray(v) ? v.join(', ') : String(v);
    });

    // Only add authorization header if token exists and is valid
    if (token) headers['authorization'] = `Bearer ${token}`;

    const fetchOptions: any = {
      method: req.method,
      headers,
      redirect: 'manual' as const,
      body: ['GET', 'HEAD'].includes(req.method || '') ? undefined : req,
    };

    const backendResp = await fetch(targetUrl, fetchOptions);
    const backendData = await backendResp.json();

    backendResp.headers.forEach((value, key) => {
      if (
        [
          'transfer-encoding',
          'connection',
          'keep-alive',
          'proxy-authenticate',
          'proxy-authorization',
          'te',
          'trailers',
          'upgrade',
        ].includes(key.toLowerCase())
      ) {
        return;
      }
      res.setHeader(key, value);
    });

    res.status(backendResp.status).json(backendData);
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
