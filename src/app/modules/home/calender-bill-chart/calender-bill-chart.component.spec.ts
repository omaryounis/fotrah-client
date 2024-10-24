import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderBillChartComponent } from './calender-bill-chart.component';

describe('CalenderBillChartComponent', () => {
  let component: CalenderBillChartComponent;
  let fixture: ComponentFixture<CalenderBillChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalenderBillChartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CalenderBillChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
