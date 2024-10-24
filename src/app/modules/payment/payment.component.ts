import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { BreadcrumbService } from '@shared/services/breadcrumb/breadcrumb.service';
import { LanguageService } from '@shared/services/language/language.service';
import { ButtonModule } from 'primeng/button';
import { IPayment } from './payment.model';
import { PaymentPageComponent } from './payment-page/payment-page.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  imports: [ButtonModule, PageHeaderComponent, TranslateModule, PaymentPageComponent],
  standalone: true,
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  browserLang: string = localStorage.getItem('lang')! || 'ar';
  billNumber: string = "";
  requestData?: IPayment;
  
  constructor(public languageService: LanguageService, private breacrumbService: BreadcrumbService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.params.subscribe(res => this.billNumber = res['billNumber']);
  }
  toggleLang() {
     
    const switchedLanguage = localStorage.getItem('lang')! == 'ar' ? 'en' : 'ar';
    this.browserLang = switchedLanguage;
    this.languageService.switchLanguage(switchedLanguage, true);
  }


}
