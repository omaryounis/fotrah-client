import { Component, OnInit } from '@angular/core';
import { ListPermitTypeComponent } from './components/list-permit-type/list-permit-type.component';

@Component({
  selector: 'app-permit-types',
  standalone : true,
  imports : [ListPermitTypeComponent],
  templateUrl: './permit-types.component.html',
  styleUrls: ['./permit-types.component.scss']
})
export class PermitTypesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
