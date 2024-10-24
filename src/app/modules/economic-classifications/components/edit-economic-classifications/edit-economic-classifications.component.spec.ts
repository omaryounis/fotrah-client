import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEconomicClassificationsComponent } from './edit-economic-classifications.component';

describe('EditEconomicClassificationsComponent', () => {
  let component: EditEconomicClassificationsComponent;
  let fixture: ComponentFixture<EditEconomicClassificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEconomicClassificationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditEconomicClassificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
