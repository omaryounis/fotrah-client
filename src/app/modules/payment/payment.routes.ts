import { Routes } from "@angular/router";
import { PaymentPageComponent } from "./payment-page/payment-page.component";
import { PaymentSuccessComponent } from "./payment-success/payment-success.component";
import { PaymentFailureComponent } from "./payment-failure/payment-failure.component";
import { SadadPaymentComponent } from "./sadad-payment/sadad-payment.component";


export const paymentRouters: Routes = [
  {
    path: "payment/:billNumber",
    component: PaymentPageComponent
  },
  {
    path: "payment-success",
    component: PaymentSuccessComponent
  },
  {
    path: "payment-failure",
    component: PaymentFailureComponent
  },
  {
    path: "sadad-payment/:billNumber",
    component: SadadPaymentComponent
  },
];
