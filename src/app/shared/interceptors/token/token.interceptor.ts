import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = localStorage.getItem("accessToken");
  const skip = req.headers.has('skip');

  if ((accessToken && !skip ) && !req.url.includes('/RefreshToken')  ) {
    const modifyiedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });

    return next(modifyiedReq);
  }
  return next(req);
};
