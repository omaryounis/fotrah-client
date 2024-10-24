import { Component, OnInit } from '@angular/core';
import { ListFinancialsPermitsComponent } from './components/list-financials-permits/list-financials-permits.component';

@Component({
  selector: 'app-financials-permits',
  standalone : true,
  imports : [ListFinancialsPermitsComponent],
  templateUrl: './financials-permits.component.html',
  styleUrls: ['./financials-permits.component.scss']
})
export class FinancialsPermitsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
