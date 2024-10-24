import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { RadioButtonModule } from 'primeng/radiobutton';

import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { BillSearchTableComponent } from './components/bill-search-table/bill-search-table.component';
import { SearchByBillFromComponent } from './components/search-by-bill-from/search-by-bill-from.component';
import { SearchByIdentityFormComponent } from './components/search-by-identity-form/search-by-identity-form.component';

import { PublicBillInqueryService } from '@shared/services/public-bill-inquery/public-bill-inquery.service';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { LanguageService } from '@shared/services/language/language.service';
import { BreadcrumbService } from '@shared/services/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-public-bill-inquery',
  standalone: true,
  imports: [FormsModule, RadioButtonModule, PageHeaderComponent, BillSearchTableComponent, SearchByBillFromComponent, SearchByIdentityFormComponent , TranslateModule , ButtonModule],
  templateUrl: './public-bill-inquery.component.html',
  styleUrl: './public-bill-inquery.component.scss'
})
export class PublicBillInqueryComponent implements OnInit {
  showSearchResults!: any;
  selectedSearchType: string = 'searchByBill'; // Set initial view
  browserLang: string = localStorage.getItem('lang')!;

  constructor(private publicBillInqueryService: PublicBillInqueryService , private languageService :LanguageService , private breacrumbService :BreadcrumbService) { }

  onRadioChange(event: any) {
    this.selectedSearchType = event.target.value;
  }

  backToHome() {
    this.publicBillInqueryService.showBill.set(false);
  }

  ngOnInit(): void {
    this.showSearchResults = this.publicBillInqueryService.showBill;
  }
  toggleLang() {
    const switchedLanguage = localStorage.getItem('lang')! == 'ar' ? 'en' : 'ar';
    this.browserLang = switchedLanguage;
    this.languageService.switchLanguage(switchedLanguage, true);
    this.breacrumbService.initializeBreadCrumb();
  }
}
