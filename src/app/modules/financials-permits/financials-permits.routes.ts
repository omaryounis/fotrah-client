import { Routes } from "@angular/router";
import { FinancialsPermitsComponent } from "./financials-permits.component";
import { PermissionGuard } from "@shared/guards/permission/permission.guard";

export const financialPermitsRoutes: Routes = [
    {
      path: "financials-pemits",
      component: FinancialsPermitsComponent,
      canActivate: [PermissionGuard],
      data: { 
        permissions : ['List_PermitConfigration']
       }
    },
  ];