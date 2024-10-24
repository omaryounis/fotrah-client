import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CardModule } from 'primeng/card';
import { CanComponent } from '../can/can.component';
import { Actions } from '@shared/services/ability/ability.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-statistics-card',
  standalone: true,
  imports: [CardModule, RouterModule, TranslateModule ,CanComponent , CurrencyPipe],
  templateUrl: './statistics-card.component.html',
  styleUrl: './statistics-card.component.scss',
})
export class StatisticsCardComponent {
  @Input() title: string = '';
  @Input() percentage: string = '';
  @Input() action? :Actions ;
  @Input() resource: string = '';
  @Input() bodyText: string = '';
  @Input() isCurrency:boolean =false;
  @Input() isAuthorized: boolean =false;
  @Input() detailsUrl: string = '';
  @Input() iconPath: string = '';
  @Input() iconAlt: string = '';
}
