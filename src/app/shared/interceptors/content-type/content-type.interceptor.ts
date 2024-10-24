import { HttpInterceptorFn } from '@angular/common/http';

export const contentTypeInterceptor: HttpInterceptorFn = (req, next) => {
  let contentType = (/CancelRefund|BillCancel/.test(req.url)) ? {} : { 'Content-Type': 'application/json' } as {};
  const modifyiedReq = req.clone({
    // setHeaders: Object.assign(contentType, { accept: '*/*' })
  });

  return next(modifyiedReq);
};
