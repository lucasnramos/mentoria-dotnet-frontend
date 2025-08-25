import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import cookieParser from 'cookie-parser';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());
app.use(cookieParser());

const serviceMap: { prefix: string; baseUrl: string }[] = [
  { prefix: '/api/user', baseUrl: 'http://localhost:5294' },
  { prefix: '/api/product', baseUrl: 'http://localhost:5124' },
];

/**
 * Login route: proxy credentials to identity microservice and set an HttpOnly cookie
 * Client posts credentials to /api/auth/login. The backend response is forwarded
 * but the access token is stored in an HttpOnly cookie by this server.
 */
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const identityUrl = 'http://localhost:5294/api/user/login';
    const resp = await fetch(identityUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await resp.json();

    if (!resp.ok || !data?.accessToken) {
      const errorData = await resp.json();
      res.status(resp.status).json(errorData);
      return;
    }

    const cookieOpts = {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'lax' as const,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    };
    res.cookie('accessToken', data.accessToken, cookieOpts);

    res.status(200).json({
      authenticated: data.authenticated ?? true,
      message: data.message ?? 'ok',
    });
    return;
  } catch (err) {
    next(err);
  }
});

/**
 * Generic proxy for /api/* - finds the matching microservice, forwards request and
 * injects Authorization from HttpOnly cookie if present.
 */
app.use('/api', async (req, res, next) => {
  try {
    const service =
      serviceMap.find((s) => req.originalUrl.startsWith(s.prefix)) ?? null;

    if (!service) {
      res.status(502).json({ message: 'No backend mapping for request' });
      return;
    }

    const targetUrl = `${service.baseUrl}${req.originalUrl}`;
    const token = req.cookies?.accessToken;

    // clone headers but avoid host/content-length
    const headers: Record<string, string> = {};
    Object.entries(req.headers).forEach(([k, v]) => {
      if (!v) return;
      if (k === 'host' || k === 'content-length') return;
      headers[k] = Array.isArray(v) ? v.join(', ') : String(v);
    });

    if (token) headers['authorization'] = `Bearer ${token}`;

    const fetchOptions: any = {
      method: req.method,
      headers,
      redirect: 'manual' as const,
      body: ['GET', 'HEAD'].includes(req.method || '') ? undefined : req,
    };

    const backendResp = await fetch(targetUrl, fetchOptions);

    res.status(backendResp.status);
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

    const text = await backendResp.text();
    res.send(text);
  } catch (err) {
    next(err);
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

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
