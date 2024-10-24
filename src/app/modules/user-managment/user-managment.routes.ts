import { Routes } from "@angular/router";
import { UserManagmentComponent } from "./user-managment.component";
import { PermissionGuard } from "@shared/guards/permission/permission.guard";


export const userManagmentRoutes: Routes = [
  {
    path: "user-managment",
    component: UserManagmentComponent,
    canActivate: [PermissionGuard],
    data: { 
      permissions : ['List_Users']
     }
  },
];
