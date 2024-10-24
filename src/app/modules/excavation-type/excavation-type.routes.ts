import { Routes } from "@angular/router";
import { ExcavationTypeComponent } from "./excavation-type.component";
import { PermissionGuard } from "@shared/guards/permission/permission.guard";



export const excavationTypeRoutes: Routes = [
  {
    path: "excavation/:excavationRoute",
    component: ExcavationTypeComponent,
    canActivate: [PermissionGuard],
    data: { 
      permissions : ['List_ExcavationType' , 'List_ExcavationPathType']
     }
  },
];
