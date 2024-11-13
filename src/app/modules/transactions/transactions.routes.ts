import { Routes } from "@angular/router";
import { TasksComponent } from "./components/tasks/tasks.component";
import { TransactionsComponent } from "./transactions.component";
import { ListOrdersComponent } from "./components/orders/components/list-orders/list-orders.component";
import { OrdersComponent } from "./components/orders/orders.component";
import { ListObjectionsMissionsComponent } from "./components/objections/list-objections-tasks/list-objections-tasks.component";

export const transactionsRoutes: Routes = [
  {
    path: "transactions",
    component: TransactionsComponent,
  },
  {
    path: "transactions/tasks",
    component: TasksComponent,
  },
  {
    path: "transactions/requests",
    component: OrdersComponent,
  },
  {
    path:"transactions/tasks/objections-missions",
    component: ListObjectionsMissionsComponent
  }
];
