import { Component } from "@angular/core";

import { ListFinancialsComponent } from "./components/list-financials/list-financials.component";

@Component({
  selector: "app-financials",
  standalone: true,
  imports: [ListFinancialsComponent],
  templateUrl: "./financials.component.html",
  styleUrl: "./financials.component.scss",
})
export class FinancialsComponent {}
