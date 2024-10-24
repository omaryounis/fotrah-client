import { Component } from "@angular/core";

import { ListMunicipalityComponent } from "./components/list-municipality/list-municipality.component";

@Component({
  selector: "app-municipalities",
  standalone: true,
  imports: [ListMunicipalityComponent],
  templateUrl: "./municipalities.component.html",
  styleUrl: "./municipalities.component.scss",
})
export class MunicipalitiesComponent {}
