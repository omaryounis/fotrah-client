import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CanComponent } from '@shared/components/can/can.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-sub-features',
  standalone: true,
  imports: [PageHeaderComponent, CanComponent, RouterModule, TranslateModule],
  templateUrl: './sub-features.component.html',
  styleUrl: './sub-features.component.scss'
})
export class SubFeaturesComponent {
  billType :string = "violations";
  cardItems: any[] = [ ];

  constructor(private route :ActivatedRoute){
   route.params.subscribe(res => this.billType = res['billType']);
   if (this.billType == 'violations') {
     this.cardItems = [
      // { image: 'assets/images/icons/mokhalfat.svg', routerLink: `/dashboard/features/${this.billType}/cancel-bill`, title: "cancel-bill"  ,action : 'Request' , resource : 'CancelBill'  },
      { image: 'assets/images/icons/mokhalfat.svg', routerLink: `/dashboard/features/${this.billType}/cancel-refund-request`, title: "cancel-refund-request" , action : 'Cancel' , resource : 'Refund' },
      { image: 'assets/images/icons/mokhalfat.svg', routerLink: `/dashboard/features/${this.billType}/refund-request`, title: "refund-request" , action : 'Cancel' , resource : 'Refund' },
      { image: 'assets/images/icons/mokhalfat.svg', routerLink: `/dashboard/features/${this.billType}/quality-request`, title: "quality-request" , action : 'Request' , resource : 'CancelBill' },
     ]
   } else {
    this.cardItems = [
      { image: 'assets/images/icons/mokhalfat.svg', routerLink: `/dashboard/features/${this.billType}/cancel-bill`, title: "cancel-bill", action : 'Request' , resource : 'CancelBill' },
     ]
   }
  }
}
