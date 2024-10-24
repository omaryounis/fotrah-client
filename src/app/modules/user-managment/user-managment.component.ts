import { Component } from "@angular/core";

import { ListUsersComponent } from "./components/list-users/list-users.component";

@Component({
  selector: "app-user-managment",
  standalone: true,
  imports: [ListUsersComponent],
  templateUrl: "./user-managment.component.html",
  styleUrl: "./user-managment.component.scss",
})
export class UserManagmentComponent {
  constructor() {}
}
