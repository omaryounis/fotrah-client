import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEconomicClassificationsComponent } from './show-economic-classifications.component';

describe('ShowEconomicClassificationsComponent', () => {
  let component: ShowEconomicClassificationsComponent;
  let fixture: ComponentFixture<ShowEconomicClassificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowEconomicClassificationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowEconomicClassificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
