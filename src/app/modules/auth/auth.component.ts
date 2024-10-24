import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbService } from '@shared/services/breadcrumb/breadcrumb.service';
import { LanguageService } from '@shared/services/language/language.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet , ButtonModule , TranslateModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  browserLang: string = localStorage.getItem('lang')!;
  /**
   *
   */
  constructor(private languageService :LanguageService , private breadcumbService : BreadcrumbService) {
  
    
  }
  toggleLang() {
    const switchedLanguage = localStorage.getItem('lang')! == 'ar' ? 'en' : 'ar';
    this.browserLang = switchedLanguage;
    this.languageService.switchLanguage(switchedLanguage, true);
    this.breadcumbService.initializeBreadCrumb();
  }
}
