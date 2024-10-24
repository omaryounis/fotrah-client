import { Routes } from "@angular/router";
import { RolesManagementComponent } from "./roles-management.component";
import { PermissionGuard } from "@shared/guards/permission/permission.guard";

export const rolesManagementRoutes: Routes = [
  {
    path: "roles-management",
    component: RolesManagementComponent,
    data: {
      permissions: ['List_Roles']
    },
    canActivate: [PermissionGuard],
  },
];
