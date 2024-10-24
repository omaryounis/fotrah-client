import { Routes } from "@angular/router";

import { authGuard } from "@shared/guards/auth/auth.guard";

import { authRoutes } from "./modules/auth/auth.routes";
import { homeRoutes } from "./modules/home/home.routes";

import { queriesRoutes } from "./modules/queries/queries.routes";
import { reportsRoutes } from "./modules/reports/reports.routes";
import { activitiesRoutes } from "./modules/activities/activities.routes";
import { financialsRoutes } from "./modules/financials/financials.routes";
import { userManagmentRoutes } from "./modules/user-managment/user-managment.routes";
import { municipalitiesRoutes } from "./modules/municipalities/municipalities.routes";
import { publicBillInqueryRoutes } from "./modules/public-bill-inquery/public-bill-inquery.routes";
import { mainDataManagmentRoutes } from "./modules/main-data-managment/main-data-managment.routes";
import { economicClassificationsRoutes } from "./modules/economic-classifications/economic-classifications.routes";

import { GuestLayoutComponent } from "@shared/layouts/guest-layout/guest-layout.component";
import { DashboardLayoutComponent } from "./shared/layouts/dashboard-layout/dashboard-layout.component";
import { rolesManagementRoutes } from "./modules/roles-management/roles-management.routes";
import { profileRoutes } from "./modules/profile/profile.routes";
import { featuresRoutes } from "./modules/features/features.routes";
import { transactionsRoutes } from "./modules/transactions/transactions.routes";
import { paymentRouters } from "./modules/payment/payment.routes";
import { permitTypesRoutes } from "./modules/permit-types/permit-types.routes";
import { excavationTypeRoutes } from "./modules/excavation-type/excavation-type.routes";
import { financialPermitsRoutes } from "./modules/financials-permits/financials-permits.routes";

export const routes: Routes = [
  ...authRoutes,
  {
    path: "",
    redirectTo: "/auth",
    pathMatch: "full",
  },
  {
    path: "public",
    component: GuestLayoutComponent,
    children: [
      ...publicBillInqueryRoutes,
      { path: '', redirectTo: '/public/bill-inquery', pathMatch: 'full' },
      ...paymentRouters,

    ]
  },
  {
    path: "dashboard",
    component: DashboardLayoutComponent,
    canActivateChild: [authGuard],
    children: [
      ...homeRoutes,
      ...transactionsRoutes,
      ...profileRoutes,
      ...reportsRoutes,
      ...queriesRoutes,
      ...featuresRoutes,
      ...activitiesRoutes,
      ...financialsRoutes,
      ...userManagmentRoutes,
      ...rolesManagementRoutes,
      ...municipalitiesRoutes,
      ...mainDataManagmentRoutes,
      ...economicClassificationsRoutes,
      ...permitTypesRoutes,
      ...excavationTypeRoutes,
      ...financialPermitsRoutes
    ],
  },
];
