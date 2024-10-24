import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { HttpInterceptorFn } from '@angular/common/http';

import { LoaderService } from '@shared/services/loader/loader.service';

let totalRequests = 0;

export const loadingSpinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  if (req.url.includes('Notifications')) {
    loaderService.setLoading(false);
    return next(req);
  } else {
    loaderService.setLoading(true);
    totalRequests++;
    return next(req).pipe(
      finalize(() => {
        totalRequests--;
        if (totalRequests == 0) {
          loaderService.setLoading(false);
        }
      })
    );
  } 

};
