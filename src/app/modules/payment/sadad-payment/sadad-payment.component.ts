import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentComponent } from '../payment.component';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sadad-payment',
  standalone : true,
  imports : [TranslateModule ,PaymentComponent , ButtonModule],
  templateUrl: './sadad-payment.component.html',
  styleUrls: ['./sadad-payment.component.scss']
})
export class SadadPaymentComponent implements OnInit {
  billNumber: any;

  constructor(private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.params.subscribe(res => this.billNumber = res['billNumber']);
  }
  backtoPrvious = () => history.back();
}
