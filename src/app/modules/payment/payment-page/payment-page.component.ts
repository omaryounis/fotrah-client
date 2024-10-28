import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { IPayment } from "../payment.model";
import { environment } from "@root/src/environments/environment";
import { PaymentService } from "@shared/services/payment/payment.service";
import { FormsModule } from "@angular/forms";
import { PaymentComponent } from "../payment.component";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { LanguageService } from "@shared/services/language/language.service";

@Component({
  selector: "app-payment-page",
  standalone: true,
  imports: [ButtonModule, TranslateModule, FormsModule, PaymentComponent],
  templateUrl: "./payment-page.component.html",
  styleUrls: ["./payment-page.component.scss"],
})
export class PaymentPageComponent implements OnInit {
  requestData?: IPayment = {};
  @Input() billNumber: string = "";
  @ViewChild("payForm") form = {} as ElementRef;
  source: string = "";
  redirectUrl: string = "";
  paymentMethods = [
    {
      image: "assets/images/icons/bank-method.png",
      routerLink: `/bank-payment`,
      title: "bank-payment",
      details : 'pay-cards'
    },
    {
      image: "assets/images/icons/sadad.png",
      routerLink: `/public/sadad-payment`,
      title: "sdad",
      details : 'pay-sadad'

    },
  ];
  constructor(
    private paymentService: PaymentService,
    private router: ActivatedRoute,
    private route: Router,
    private messgeService: MessageService,
    private langService:LanguageService
  ) {
    router.params.subscribe((res) => (this.billNumber = res["billNumber"]));
    router.queryParams.subscribe((res) => {
      this.source = res["source"]!
      this.redirectUrl = decodeURIComponent(res['redirectUrl']);

    }
      
    );
    this.paymentMethods.forEach((element) => {
      element.routerLink += "/" + this.billNumber;
    });
    //sop returned to source of payment
    localStorage.setItem("sop", this.source);
    localStorage.setItem("redirectUrl", this.redirectUrl);
  }

  ngOnInit() {}
  preparePayRequest() {
    // this.messgeService.add({
    //   summary: this.langService.getInstantTranslation("sorry"),
    //   detail: this.langService.getInstantTranslation(
    //     "service-not-available-now"
    //   ),
    //   severity: "info",
    // });

    this.paymentService
      .preparePayInfo(this.billNumber)
      .subscribe((response: any) => {
        this.requestData = response.data;
        this.requestData!.responseURL = environment.responseURL;
        // this.requestData!.redirectURL = environment.redirectURL;
        this.requestData!.errorURL = environment.errorURL;
        this.requestData!.action = this.requestData?.redirectURL;
        setTimeout(() => {
          this.form.nativeElement.submit();
        }, 1000);
      });
  }
  navigateSadad = (link: string) => this.route.navigate([link]);
  backtoPrvious = () => history.back();
}
