import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-activation-deactivation-process',
  templateUrl: './activation-deactivation-process.component.html',
  styleUrls: ['./activation-deactivation-process.component.scss']
})
export class ActivationDeactivationProcessComponent implements OnInit {
  @Input() rowData: any;
  constructor() { }

  ngOnInit() {
  }

}
