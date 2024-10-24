import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-bill-print',
  standalone: true,
  imports: [DatePipe, ButtonModule, TranslateModule],
  templateUrl: './bill-print.component.html',
  styleUrl: './bill-print.component.scss'
})
export class BillPrintComponent {
  @ViewChild("billPrintContent") billPrintContent!: ElementRef;
  @Input() rowData: any;
  @Input() btnText: any;
  @Input() withPrint: boolean = true;
  pageDirection = 'rtl';
  constructor() {
    this.pageDirection = localStorage.getItem('lang') == 'ar' ? 'rtl' : 'ltr';
  }
  printBill() {
    
    this.rowData;
    const printContent = this.billPrintContent.nativeElement.innerHTML;
    const printWindow: any = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <html dir='${this.pageDirection}'>
        <head>
          <base href="/">
          <style>
            body {-webkit-print-color-adjust: exact; font-family: 'Neo Sans Arabic'; }
            img {
              -webkit-print-color-adjust: exact;
            }
            @media screen {
              .bill-content { display: none; }
            }
            @media print {
              
            }
            img {
              -webkit-print-color-adjust: exact;
            }
            @font-face {
              font-family: "Neo Sans Arabic";
              src: url("/assets/fonts/alfont_com_NeoSansArabic.ttf") format("truetype");
              font-weight: normal;
              font-style: normal;
            }
            header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 75px;
            }
            .table-section {
              margin-bottom: 30px;
            }
            .table-section h3 {
              margin-bottom: 7px;
            }
            .first-table, .second-table, .third-table {
              width: 100%;
              border-collapse: collapse;
              text-align: start;
              margin-top: 20px;
              font-weight: 500;
            }
            .first-table th,
            .second-table th {
              background-color: #F8F8F8;
              padding: 10px;
              text-align: center;
              font-weight: 500;
              border: 2px solid #E3E7EC;
              border-left: 0;
              border-right: 0;
            }
            .first-table th:first-of-type,
            .second-table th:first-of-type {
              border-right: 2px solid #E3E7EC;
            }
            .first-table th:last-of-type,
            .second-table th:last-of-type {
              border-left: 2px solid #E3E7EC;
            }
            .first-table td,
            .second-table td {
              padding: 10px;
              border: 2px solid #E3E7EC;
              text-align: center;
              max-width: 290px;
              color: #595959;
            }
            .third-table tr td {
              border: 1px solid #E3E7EC;
              padding: 8px;
              text-align: start;
              font-weight: 500;
            }
            .third-table tr td:first-of-type {
              background-color: #F8F8F8;
              text-align: center;
              border: 1px solid #E3E7EC;
              padding: 8px;
              max-width: 100px;
            }
            .third-table tr td.green {
              color: #4E9B6E;
            }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    if (this.withPrint) {
      setTimeout(function () {
        printWindow.document.close();
        printWindow.print();

        printWindow.onafterprint = () => printWindow.close();
      }, 250);
    }
  }
  checkBillType() :boolean { return this.rowData?.billCategory.toLowerCase() == 'violation' || this.rowData?.billCategory.toLowerCase() == 'مخالفة'};
  calculatePaidAmount() : number {
    if(this.checkBillType()) return this.rowData.totalAmount;
    else return  this.rowData.totalAmount - this.rowData?.permitVisitFees;
  }
}
