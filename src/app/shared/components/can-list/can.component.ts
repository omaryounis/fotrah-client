import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { AbilityService } from "@casl/angular";
import { AppAbility } from "@shared/services/ability/ability.service";
import { Observable } from 'rxjs';

import { Actions, abilityObservable$ } from '@shared/services/ability/ability.service';
import { MongoAbility } from '@casl/ability';
import { LoginService } from '@shared/services/login/login.service';

@Component({
  selector: 'app-can-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './can.component.html',
  styleUrl: './can.component.scss'
})
export class CanListComponent implements OnInit {
  ability$: Observable<MongoAbility> = new Observable<AppAbility>();

  
  @Input() roles:string[] = [];
  has_permission = false;
  constructor(private authService:LoginService) { }
  
  ngOnInit(): void {
   this.has_permission = this.authService.hasPermission(this.roles);
  }
}
