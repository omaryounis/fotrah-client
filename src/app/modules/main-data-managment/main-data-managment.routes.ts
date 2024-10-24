import { Routes } from "@angular/router";
import { MainDataManagmentComponent } from "./main-data-managment.component";
import { PermissionGuard } from "@shared/guards/permission/permission.guard";

export const mainDataManagmentRoutes: Routes = [
  {
    path: "main-data-managment",
    component: MainDataManagmentComponent,
    canActivate: [PermissionGuard],
    data: { 
      permissions : ['List_MainDataManagment']
     }
  },
];
