import { Component, HostListener, OnInit, importProvidersFrom, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastModule } from 'primeng/toast';

import { SpinnerComponent } from '@shared/components/spinner/spinner/spinner.component';

import { createAbility } from '@shared/services/ability/ability.service';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from './app.config';
import { LanguageService } from '@shared/services/language/language.service';
import { Breadcrumb } from 'primeng/breadcrumb';
import { BreadcrumbService } from '@shared/services/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'RIPC';
  langService = inject(LanguageService);
  breadcumbService = inject(BreadcrumbService);
  ngOnInit(): void {
    createAbility();
    const currLang = localStorage.getItem('lang') || 'ar';
    this.langService.switchLanguage(currLang, false);
    this.breadcumbService.initializeBreadCrumb();
  }

 
}


