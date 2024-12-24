
import { Injectable, forwardRef } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { BreadcrumbService } from '../breadcrumb/breadcrumb.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  browserLang: string ="";
  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.translate.addLangs(['en', 'ar']);
    translate.defaultLang = 'en';
    if(!localStorage.getItem('lang'))  localStorage.setItem('lang' , 'ar')
    this.browserLang = localStorage.getItem('lang')!;
    this.translate.use(this.browserLang);
    this.updateDirection(this.browserLang);
  }

  switchLanguage(language: string, isReloaded: boolean) {
    this.translate.use(language);
    localStorage.setItem('lang', language);
    this.updateDirection(language);
    if (isReloaded) window.location.reload();

  }

  updateDirection(language: string) {
    const htmlTag = this.document.getElementsByTagName('html')[0] as HTMLElement;
    if (language === 'ar') {
      htmlTag.dir = 'rtl';
      htmlTag.lang = 'ar';
    } else {
      htmlTag.dir = 'ltr';
      htmlTag.lang = 'en';
    }

  }
  getInstantTranslation(key: string): string {
    let value = this.translate.instant(key);
    this.translate.get(key).subscribe(res => (value = res))
    return value;
  }

  getNameFormat() : string{
   return this.browserLang == 'en' ? 'nameEn' : 'nameAr'
  }
  getDescFormat() : string{
   return this.browserLang == 'en' ? 'descriptionEn' : 'descriptionAr'
  }
  getNameFormatAddtion(key :string) : string{
   return  key + (this.browserLang == 'en' ? 'NameEn' : 'NameAr')
  }
  getStringFormat = (key :string) : string => key + (this.browserLang == 'en' ? '' : 'Ar')
  
  getDateFormat():string{
    return this.browserLang =='en'? 'en-US' : 'ar-EG';
  }
}
