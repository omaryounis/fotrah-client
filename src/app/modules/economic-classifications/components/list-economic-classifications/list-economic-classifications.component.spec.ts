import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEconomicClassificationsComponent } from './list-economic-classifications.component';

describe('ListEconomicClassificationsComponent', () => {
  let component: ListEconomicClassificationsComponent;
  let fixture: ComponentFixture<ListEconomicClassificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEconomicClassificationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListEconomicClassificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
