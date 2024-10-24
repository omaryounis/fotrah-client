import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from "@angular/router";

import { TableComponent } from "@shared/components/table/table.component";
import { BillPrintComponent } from '@shared/components/bill-print/bill-print.component';

import { ScreenService } from '@shared/services/screen/screen.service';
import { PublicBillInqueryService } from '@shared/services/public-bill-inquery/public-bill-inquery.service';

import { IBill } from '../../public-bill-inquery.model';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { PaymentSources } from '@shared/enums/payment-sources.enum';
import { BillsStatus } from '@shared/enums/bills-status.enum';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-bill-search-table',
  standalone: true,
  imports: [RouterLink, DatePipe, TableComponent, BillPrintComponent, TranslateModule ,ButtonModule ,TagModule] ,
  templateUrl: './bill-search-table.component.html',
  styleUrl: './bill-search-table.component.scss'
})
export class BillSearchTableComponent implements OnInit {
  bills!: IBill[];
  columns: any;
  actions: any[] = [];
  showSearchResults!: any;
  showTableCollapseMode: boolean = false;
 billStatus = BillsStatus;
  constructor(private screenService: ScreenService, private publicBillInqueryService: PublicBillInqueryService, private router:Router) { }

  ngOnInit(): void {
    this.showSearchResults = this.publicBillInqueryService.showBill;
    this.showTableCollapseMode = this.screenService.isScreenBelowThan(888);
    this.columns = [
      {
        text: "رقم الفاتورة",
        dataIndex: "billNumber",
      },
      {
        text: "تاريخ الفاتورة",
        dataIndex: "billDate",
      },
      {
        text: "حالة الفاتورة",
        dataIndex: "status"
      },
      {
        text: "إجمالي الفاتورة",
        dataIndex: "totalAmount",
      },
      {
        thTemplate: "actionTemplate",
        tdTemplate: "actionListTemplate",
      },
    ];
    this.actions = [
      {
        label: "طباعة",
        icon: "pi pi-print",
        component: BillPrintComponent,
      },
    ];
    this.publicBillInqueryService.billInformation$.subscribe({
      next: (bills: IBill[]) => {
        this.bills = bills;
      }
    })
  }

  navigateToPayment(route: string) {
    this.router.navigate([route] , {queryParams : {
       source : PaymentSources.PUBLIC
     }});
     
   }
   checUnPayedBillStatus(bill :any) { return bill.status == BillsStatus.UPPAID_AR || bill.status ==  BillsStatus.UPPAID_EN  }
   checkPartialBillStatus(bill :any) { return bill.status == BillsStatus.PARTIAL_PAID_AR || bill.status ==  BillsStatus.PARTIAL_PAID_EN  }

}
