import { HttpInterceptorFn } from '@angular/common/http';

export const identityInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Identity Interceptor');

  const token = getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};

const getToken = () => {
  // localStorage.getItem('accessToken');
  return '';
};
