import { Component } from "@angular/core";

import { ListEconomicClassificationsComponent } from "./components/list-economic-classifications/list-economic-classifications.component";

@Component({
  selector: "app-economic-classifications",
  standalone: true,
  imports: [ListEconomicClassificationsComponent],
  templateUrl: "./economic-classifications.component.html",
  styleUrl: "./economic-classifications.component.scss",
})
export class EconomicClassificationsComponent {}
