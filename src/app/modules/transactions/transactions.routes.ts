import { Routes } from "@angular/router";
import { TasksComponent } from "./components/tasks/tasks.component";
import { TransactionsComponent } from "./transactions.component";
import { OrdersComponent } from "./components/orders/orders.component";
import { ListObjectionsMissionsComponent } from "./components/objections/list-objections-tasks/list-objections-tasks.component";
import { ListQualityTasksComponent } from "./components/quality/list-quality-tasks/list-quality-tasks.component";
import { ListUserQualityTasksComponent } from "./components/quality/list-user-quality-tasks/list-user-quality-tasks.component";

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
    path: "transactions/tasks/objections-missions",
    component: ListObjectionsMissionsComponent
  },
  {
    path: "transactions/tasks/quality-missions",
    component: ListQualityTasksComponent
  },
  {
    path: "transactions/tasks/user-quality-missions",
    component: ListUserQualityTasksComponent
  }
];
