import { Routes } from "@angular/router";
import { FinancialsComponent } from "./financials.component";
import {  PermissionGuard } from "@shared/guards/permission/permission.guard";

export const financialsRoutes: Routes = [
  {
    path: "financials",
    component: FinancialsComponent,
    canActivate : [PermissionGuard],
    data: { permissions: ['List_FinancialItems'] }
  },
];
