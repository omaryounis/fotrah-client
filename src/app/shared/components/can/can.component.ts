import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { AbilityService } from "@casl/angular";
import { AppAbility } from "@shared/services/ability/ability.service";
import { Observable } from 'rxjs';

import { Actions, abilityObservable$ } from '@shared/services/ability/ability.service';
import { MongoAbility } from '@casl/ability';

@Component({
  selector: 'app-can',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './can.component.html',
  styleUrl: './can.component.scss'
})
export class CanComponent implements OnInit {
  ability$: Observable<MongoAbility> = new Observable<AppAbility>();

  @Input({ required: true }) action!: Actions;
  @Input({ required: true }) resource!: string;

  constructor(private abilityService: AbilityService<AppAbility>) { }

  ngOnInit(): void {
    abilityObservable$.subscribe((values) => {
      this.ability$ = abilityObservable$;
    })
  }
}
