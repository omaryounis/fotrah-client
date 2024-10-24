import { Routes } from "@angular/router";

import { QueriesComponent } from "./queries.component";
import { PermissionGuard } from "@shared/guards/permission/permission.guard";


export const queriesRoutes: Routes = [
  {
    path: "queries",
    component: QueriesComponent,
    canActivate: [PermissionGuard],
    data: { 
      permissions : ['Read_BillInquiry']
     }
  },
];
