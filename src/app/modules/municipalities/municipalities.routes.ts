import { Routes } from "@angular/router";

import { MunicipalitiesComponent } from "./municipalities.component";
import { PermissionGuard } from "@shared/guards/permission/permission.guard";

export const municipalitiesRoutes: Routes = [
  {
    path: "municipalities",
    component: MunicipalitiesComponent,
    canActivate: [PermissionGuard],
    data: { 
      permissions : ['List_Municipals']
     }
  },
];
