import { Component } from "@angular/core";

import { LinkCardComponent } from "./components/link-card/link-card.component";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-main-data-managment",
  standalone: true,
  imports: [LinkCardComponent, PageHeaderComponent, TranslateModule],
  templateUrl: "./main-data-managment.component.html",
  styleUrl: "./main-data-managment.component.scss",
})
export class MainDataManagmentComponent { }
