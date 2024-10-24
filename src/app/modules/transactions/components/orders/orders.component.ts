import { Component } from "@angular/core";

import { ListOrdersComponent } from "./components/list-orders/list-orders.component";
import { ActivatedRoute } from "@angular/router";
import { ListObjectionsComponent } from "./components/list-objections/list-objections.component";

@Component({
  selector: "app-tasks",
  standalone: true,
  imports: [ListOrdersComponent , ListObjectionsComponent],
  templateUrl: "./orders.component.html",
  styleUrl: "./orders.component.scss",
})
export class OrdersComponent {
  requests_type: string = 'a'; 
  /**
   *
   */
  constructor(private router :ActivatedRoute) {
    router.queryParams.subscribe(res => {
       
      this.requests_type = res['request_type']!
    }
      
      )

    
  }
}
