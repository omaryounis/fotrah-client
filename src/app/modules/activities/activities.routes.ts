import { Routes } from "@angular/router";
import { ActivitiesComponent } from "./activities.component";
import { PermissionGuard } from "@shared/guards/permission/permission.guard";

export const activitiesRoutes: Routes = [
  {
    path: "activities",
    component: ActivitiesComponent,
    canActivate: [PermissionGuard],
    data: { 
      permissions : ['List_Activities']
     }
  },
];
