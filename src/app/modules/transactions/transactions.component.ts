import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CanComponent } from '@shared/components/can/can.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LanguageService } from '@shared/services/language/language.service';
import { CanListComponent } from "../../shared/components/can-list/can.component";
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [PageHeaderComponent, CanComponent, RouterModule, TranslateModule, CanListComponent, JsonPipe],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})  
export class TransactionsComponent {
  langService = inject(LanguageService)
  cardItems: any[] = [
    { action : 'View',resource : "Missions" , image: 'assets/images/icons/tasks.png', routerLink: '/dashboard/transactions/tasks', title: this.langService.getInstantTranslation('tasks') },
    { action : 'View',resource : "Requests" ,image: 'assets/images/icons/requests.png', routerLink: '/dashboard/transactions/requests', params : 'ALL' , title: this.langService.getInstantTranslation('requests') },
    { action : 'Procceed',resource : "Objection" ,image: 'assets/images/icons/requests.png', routerLink: '/dashboard/transactions/requests', params : 'OBJECTION' ,title: this.langService.getInstantTranslation('objections-requests') },
    { action : 'View',resource : "Objection Misson" ,image: 'assets/images/icons/tasks.png', routerLink: '/dashboard/transactions/tasks/objections-missions' ,title: this.langService.getInstantTranslation('objections-missions') },
  ]
}
 