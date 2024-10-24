import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomicClassificationFormComponent } from './economic-classification-form.component';

describe('EconomicClassificationFormComponent', () => {
  let component: EconomicClassificationFormComponent;
  let fixture: ComponentFixture<EconomicClassificationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EconomicClassificationFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EconomicClassificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
