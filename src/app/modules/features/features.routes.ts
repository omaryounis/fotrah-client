import { Routes } from "@angular/router";

import { FeaturesComponent } from "./features.component";
import { SubFeaturesComponent } from "./components/sub-features/sub-features.component";
import { CancelViolationComponent } from "./components/cancel-violation/cancel-violation.component";
import { PermissionGuard } from "@shared/guards/permission/permission.guard";
import { QualityCancelViolationComponent } from "./components/quality-cancel-violation/quality-cancel-violation.component";


export const featuresRoutes: Routes = [
  {
    path: "features",
    component: FeaturesComponent,
    // canActivate : [PermissionGuard],
    // data: { permissions : ['View_Features'] }
  },
  {
    path: "features/violations/quality-request",
    component: QualityCancelViolationComponent,

  },
  {
    path: "features/:billType",
    component: SubFeaturesComponent,
  },
  {
    path: "features/:billType/:cancelType",
    component: CancelViolationComponent,

  }
];
