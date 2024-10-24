import { Routes } from "@angular/router";
import { EconomicClassificationsComponent } from "./economic-classifications.component";
import { PermissionGuard } from "@shared/guards/permission/permission.guard";


export const economicClassificationsRoutes: Routes = [
  {
    path: "economic-classifications",
    component: EconomicClassificationsComponent,
    canActivate: [PermissionGuard],
    data: { 
      permissions : ['List_Gfs']
     }
  },
];
