import { Component } from "@angular/core";

import { ListTasksComponent } from "./components/list-tasks/list-tasks.component";

@Component({
  selector: "app-tasks",
  standalone: true,
  imports: [ListTasksComponent],
  templateUrl: "./tasks.component.html",
  styleUrl: "./tasks.component.scss",
})
export class TasksComponent {}
