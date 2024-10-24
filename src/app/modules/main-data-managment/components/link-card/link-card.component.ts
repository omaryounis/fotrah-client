import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-link-card",
  standalone: true,
  imports: [RouterLink, CanComponent, TranslateModule],
  templateUrl: "./link-card.component.html",
  styleUrl: "./link-card.component.scss",
})
export class LinkCardComponent {
  constructor() { }
}
