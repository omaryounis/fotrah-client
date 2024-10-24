import { Component, Inject, OnInit } from "@angular/core";
import { PaymentComponent } from "../payment.component";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { PaymentSources } from "@shared/enums/payment-sources.enum";
import { environment } from "@root/src/environments/environment";
import { window } from "rxjs";
import { DOCUMENT } from "@angular/common";
import { BillService } from "@shared/services/bill/bill.service";
import { Clipboard } from "@angular/cdk/clipboard";

@Component({
  selector: "app-payment-success",
  imports: [PaymentComponent, TranslateModule, ButtonModule, RouterModule],
  standalone: true,
  templateUrl: "./payment-success.component.html",
  styleUrls: ["./payment-success.component.scss"],
})
export class PaymentSuccessComponent implements OnInit {
  billNumber: string = "";
  billData: any;
  billRefNumber: string = "";
  constructor(
    private router: ActivatedRoute,
    private billService: BillService,
    private clipboard: Clipboard,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    this.router.queryParams.subscribe((res) => {
      this.billNumber = res["billNumber"];
      this.billRefNumber = res["billRefNo"];
    });
    this.getBillData();
  }
  finishProcess = () => {
    const source = localStorage.getItem("sop");
    const navigateUrl =
      source === PaymentSources.PORTAL
        ? location.origin + "/dashboard/queries"
        : source === PaymentSources.PUBLIC
          ? location.origin + "/public/bill-inquery"
          : environment.tahakomUrl;
    this.document.location.href = navigateUrl;
  };
  getBillData() {
    this.billService.publicBill(this.billNumber).subscribe((response) => {
      this.billData = response.data;
    });
  }
  checkBillType(): boolean {
    return (
      this.billData?.billCategory.toLowerCase() == "violation" ||
      this.billData?.billCategory.toLowerCase() == "مخالفة"
    );
  }
  copyText = () => this.clipboard.copy(this.billRefNumber);

}
