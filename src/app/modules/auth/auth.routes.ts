import { Routes } from '@angular/router';

import { canVisitLoginGuard } from '@shared/guards/auth/can-visit-login.guard';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

export const authRoutes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    canActivateChild: [canVisitLoginGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      }
    ],
  },
];
