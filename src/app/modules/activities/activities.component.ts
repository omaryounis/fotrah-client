import { Component } from "@angular/core";

import { ListActivitiesComponent } from "./components/list-activities/list-activities.component";

@Component({
  selector: "app-activities",
  standalone: true,
  imports: [ListActivitiesComponent],
  templateUrl: "./activities.component.html",
  styleUrl: "./activities.component.scss",
})
export class ActivitiesComponent {}
