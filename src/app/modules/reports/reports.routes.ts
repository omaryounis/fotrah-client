import { Routes } from "@angular/router";
import { ReportsComponent } from "./reports.component";
import { PermissionGuard } from "@shared/guards/permission/permission.guard";

export const reportsRoutes: Routes = [
  {
    path: "reports",
    component: ReportsComponent,
    
  },
];
