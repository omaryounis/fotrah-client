import { Component, OnInit } from "@angular/core";

import { BreadcrumbModule } from "primeng/breadcrumb";

import { BreadcrumbService } from "@shared/services/breadcrumb/breadcrumb.service";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from "@shared/services/language/language.service";

@Component({
  selector: "app-breadcrumb",
  standalone: true,
  imports: [BreadcrumbModule, TranslateModule],
  templateUrl: "./breadcrumb.component.html",
  styleUrl: "./breadcrumb.component.scss",
})
export class BreadcrumbComponent {
  breadcrumbItems: any[] = [];
  currLang = localStorage.getItem('lang')!;
  constructor(private breadcrumbService: BreadcrumbService , private langService : LanguageService) { breadcrumbService.initializeBreadCrumb(); }

  ngOnInit() {

    this.breadcrumbService.breadcrumbItems$.subscribe((items) => {
      this.breadcrumbItems = items.map((item) => ({
        routerLink : item.routerLink,
        label : this.langService.getInstantTranslation(item.label)
      }));
    });
  }
}
