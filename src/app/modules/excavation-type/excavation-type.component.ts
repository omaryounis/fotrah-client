import { Component, OnInit } from '@angular/core';
import { ListExcavationTypesComponent } from './components/list-excavation-types/list-excavation-types.component';

@Component({
  selector: 'app-excavation-type',
  standalone: true,
  imports: [ListExcavationTypesComponent],
  templateUrl: './excavation-type.component.html',
  styleUrls: ['./excavation-type.component.scss']
})
export class ExcavationTypeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
