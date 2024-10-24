import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from "@angular/core";

import { BillPrintComponent } from '@shared/components/bill-print/bill-print.component';
import { SearchBarComponent } from "@shared/components/search-bar/search-bar.component";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

import { BillService } from "@shared/services/bill/bill.service";
import { Subscription } from "rxjs";
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { BillsStatus } from '@shared/enums/bills-status.enum';
import { PaymentSources } from '@shared/enums/payment-sources.enum';

@Component({
  selector: "app-queries",
  standalone: true,
  imports: [BillPrintComponent, SearchBarComponent, PageHeaderComponent, DatePipe, TranslateModule ,ButtonModule ,RouterModule],
  templateUrl: "./queries.component.html",
  styleUrls: ["./queries.component.scss"],
})
export class QueriesComponent implements OnInit, OnDestroy {
  billNumber: string = '';
  showBill = this.billService.showBill;
  billInformation: any = {};
  billStatus = BillsStatus;
  billInformation$ = this.billService.billInformation$;
  billInformationSubscription!: Subscription;

  constructor(private billService: BillService, private router :Router) {
    billService.hideBillInfo()
   }

  search() {
    this.billService.searchBill(this.billNumber).subscribe((response) => {
    });
  }

  changeSearchValue(value: string) {
    this.billNumber = value;
  }

  resetSearchResults() {
    this.billNumber = "";
    this.billService.hideBillInfo();
  }

  ngOnInit(): void {
    this.billInformationSubscription = this.billInformation$.subscribe({
      next: (value) => {
        this.billInformation = value;
      }
    })
  }

  ngOnDestroy(): void {
    this.billInformationSubscription.unsubscribe();
  }
  navigateToPayment(route: string) {
   this.router.navigate([route] , {queryParams : {
      source : PaymentSources.PORTAL
    }});
    
  }
  checkBillType() :boolean { return this.billInformation?.billCategory.toLowerCase() == 'violation' || this.billInformation?.billCategory.toLowerCase() == 'مخالفة'};

}
