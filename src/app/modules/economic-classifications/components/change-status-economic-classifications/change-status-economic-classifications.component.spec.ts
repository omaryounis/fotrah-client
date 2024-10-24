/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChangeStatusEconomicClassificationsComponent } from './change-status-economic-classifications.component';

describe('ChangeStatusEconomicClassificationsComponent', () => {
  let component: ChangeStatusEconomicClassificationsComponent;
  let fixture: ComponentFixture<ChangeStatusEconomicClassificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeStatusEconomicClassificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeStatusEconomicClassificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
