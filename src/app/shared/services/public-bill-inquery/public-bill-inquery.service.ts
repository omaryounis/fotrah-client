import { signal } from '@angular/core';
import { Router } from "@angular/router";
import { Injectable } from '@angular/core';

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { toObservable } from '@angular/core/rxjs-interop';

import { MessageService } from "primeng/api";

import { environment } from '@root/src/environments/environment';
import { ISearchByBill } from '@root/src/app/modules/public-bill-inquery/public-bill-inquery.model';

@Injectable({
  providedIn: 'root'
})
export class PublicBillInqueryService {
  showBill = signal<boolean>(false);
  identityTypes = signal<any>([{}]);
  private billInformation = signal<any>({});
  billInformation$ = toObservable(this.billInformation);

  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) { }

  inqueryBill(payload: ISearchByBill, type: 'byBill' | 'byIdentity'): Observable<any> {
    this.hideBillInfo();
    let search = '';

    if (type === 'byBill') {
      search = `?BillNumber=${payload.billNumber}&IdentityNumber=${payload.identityNumber}`
    } else {
      search = `?IdentityType=${payload.identityType}&IdentityNumber=${payload.identityNumber}`
    }

    const searchByBillNumberUrl = `${environment.proxyBase}/Bill/Inquiry${search}`;
    return this.http
      .get(searchByBillNumberUrl, { headers: { skip: "true" } })
      .pipe(
        tap((success) => { this.handleSearchSuccess(success) })
      );
  }

  getIdentityTypes(): Observable<any> {
    const getIdentityTypesUrl = `${environment.proxyBase}/Lookups/IdentityTypes`;
    return this.http
      .get(getIdentityTypesUrl, { headers: { skip: "true" } })
      .pipe(
        tap((success) => { this.handleGetIdentityTypes(success) })
      );
  }

  hideBillInfo() {
    this.showBill.set(false);
  }

  showBillInfo() {
    this.showBill.set(true);
  }

  private handleSearchSuccess(response: any) {
    this.billInformation.set(response.data);
    this.showBillInfo();
  }

  private handleGetIdentityTypes(response: any) {
    this.identityTypes.set(response.data);
  }
}
