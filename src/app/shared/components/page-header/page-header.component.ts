import { Component, EventEmitter, Input, Output } from "@angular/core";

import { ButtonModule } from "primeng/button";

import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-page-header",
  standalone: true,
  imports: [ButtonModule, BreadcrumbComponent, TranslateModule],
  templateUrl: "./page-header.component.html",
  styleUrl: "./page-header.component.scss",
})
export class PageHeaderComponent {
  @Input() title: string = "";
  @Input() buttonLabel: string = "";
  @Input() showButton: boolean = true;
  @Input() showBreadcrumb: boolean = true;
  @Input() headerStyleClass: string = "";
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

  onClickButton($event: MouseEvent) {
    this.onClick.emit();
  }
}
