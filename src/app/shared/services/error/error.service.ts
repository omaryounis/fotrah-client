import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private translateService:TranslateService) { }

  getErrorMessage(error: HttpErrorResponse) {
    let errormessage = this.translateService.instant('something-wrong') ;

    if (error?.error?.message) {
      errormessage = error.error.message;
    }

    return errormessage;
  }
}
