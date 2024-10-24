import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEconomicClassificationsComponent } from './create-economic-classifications.component';

describe('CreateEconomicClassificationsComponent', () => {
  let component: CreateEconomicClassificationsComponent;
  let fixture: ComponentFixture<CreateEconomicClassificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEconomicClassificationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateEconomicClassificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
