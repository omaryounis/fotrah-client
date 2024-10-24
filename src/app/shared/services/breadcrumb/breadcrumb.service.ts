// breadcrumb.service.ts
import { Injectable } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";

import { BREADCRUMB_ITEMS_AR } from "./breadcrumb.constants";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "../language/language.service";

interface IBreadcrumbItem {
  label: string;
  routerLink: string;
}

@Injectable({
  providedIn: "root",
})
export class BreadcrumbService {
  private breadcrumbItemsSource = new BehaviorSubject<IBreadcrumbItem[]>([]);
  breadcrumbItems$ = this.breadcrumbItemsSource.asObservable();

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private langService: LanguageService) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.initializeBreadCrumb();
      });
  }

  initializeBreadCrumb() {
    const breadcrumbItems = this.createBreadcrumb(this.activatedRoute.root);
    this.updateBreadcrumb(breadcrumbItems);
  }

  private createBreadcrumb(
    route: ActivatedRoute,
    url: string = "",
    breadcrumbs: IBreadcrumbItem[] = []
  ): IBreadcrumbItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }
    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join("/");

      if (routeURL !== "") {
        url += `/${routeURL}`;
        const label = this.getLabelFromUrl(routeURL);
        breadcrumbs.push({
          label,
          routerLink: url,
        });
      }

      return this.createBreadcrumb(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private getLabelFromUrl(url: string): string {
    const parts = url.split("/");
    const label =parts[parts.length - 1];
      // BREADCRUMB_ITEMS_AR[
      // parts[parts.length - 1] as keyof typeof BREADCRUMB_ITEMS_AR
      // ];
    return label ;
  }

  updateBreadcrumb(items: IBreadcrumbItem[]) {
    this.breadcrumbItemsSource.next(items);
  }
}
