import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomicClassificationsComponent } from './economic-classifications.component';

describe('EconomicClassificationsComponent', () => {
  let component: EconomicClassificationsComponent;
  let fixture: ComponentFixture<EconomicClassificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EconomicClassificationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EconomicClassificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
