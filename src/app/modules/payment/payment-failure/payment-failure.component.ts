import { Component, Inject, OnInit } from '@angular/core';
import { PaymentPageComponent } from '../payment-page/payment-page.component';
import { PaymentComponent } from '../payment.component';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaymentSources } from '@shared/enums/payment-sources.enum';
import { environment } from '@root/src/environments/environment';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-payment-failure',
  standalone: true,
  imports: [PaymentComponent, ButtonModule, TranslateModule],
  templateUrl: './payment-failure.component.html',
  styleUrls: ['./payment-failure.component.scss']
})
export class PaymentFailureComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document, private router: ActivatedRoute, private clipboard: Clipboard) { }
  billNumber = '';
  billRefNumber = '';
  ngOnInit() {
    this.router.queryParams.subscribe((res) => {
      this.billNumber = res["billNumber"];
      this.billRefNumber = res["billRefNo"];
    });
  }
  finishProcess = () => {
    const source = localStorage.getItem("sop");
    const redirectURL = localStorage.getItem("redirectUrl")! + '?responseType=SUCCESS&responseMessageAr=تمت عملية السداد بنجاح&responseMessageEn=Payment Successfully&reponseReferenceNumber=' + this.billRefNumber;
    const navigateUrl =
         source === PaymentSources.PUBLIC
          ? location.origin + "/public/bill-inquery"
          : redirectURL;
           
    this.document.location.href = navigateUrl;
  };
  copyText = () => this.clipboard.copy(this.billRefNumber);
}
