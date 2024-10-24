import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@root/src/environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

constructor(private http: HttpClient) { }

  preparePayInfo(billNumber : string) {
    return this.http
    .post(`${environment.proxyBase}/Payment/Checkout`,  {billNumber : billNumber}, { headers: { skip: "true" } } ,)
    .pipe(
      tap((success) => { })
    );
  }
}
