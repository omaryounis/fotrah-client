import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameFormatter'
})
export class NameFormatterPipe implements PipeTransform {

  transform(value: { nameAr?: string, nameEn?: string }): string {
    if (!value || !value.nameAr || !value.nameEn) {
      return '';
    }
    
    const formattedName = localStorage.getItem('lang')! == 'en' ? value.nameEn : value.nameAr;
    return formattedName;
  }
}
