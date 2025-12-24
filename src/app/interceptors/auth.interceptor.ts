import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authData = localStorage.getItem('auth_token');
  if (authData) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Basic ${authData}`
      }
    });
    return next(cloned);
  }
  return next(req);
};