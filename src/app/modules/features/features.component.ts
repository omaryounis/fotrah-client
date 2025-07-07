import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CanComponent } from '@shared/components/can/can.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LanguageService } from '@shared/services/language/language.service';
import { MessageService } from 'primeng/api';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [PageHeaderComponent, CanComponent, RouterModule, TranslateModule, JsonPipe],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {
  messgeService = inject(MessageService);
  router = inject(Router);
  langService = inject(LanguageService);
  cardItems: any[] = []
  constructor() {
    this.cardItems = [
      { image: 'assets/images/icons/mokhalfat.svg', routerLink: '/dashboard/features/violations', title: 'violations' ,action : 'View' , resource : 'Violations' },
      { image: 'assets/images/icons/tsareeh.svg', routerLink: '/dashboard/features/permits', title: 'permits' , action : 'View' , resource : 'Permits'},
    ]
  }

  navigateToSub(route: string) {
    if (route.includes('permits')) {
      this.messgeService.add({ summary: this.langService.getInstantTranslation('sorry'), detail: this.langService.getInstantTranslation('service-not-available-now'), severity: 'info' })
    } else {
      this.router.navigate([route])
    }
  }
}
