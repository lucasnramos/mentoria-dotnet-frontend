import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

export const identityInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // Do not access token on client; server sets/accesses HttpOnly cookie and injects Authorization.
  return next(req);
};

const getToken = () => {
  return null;
};
