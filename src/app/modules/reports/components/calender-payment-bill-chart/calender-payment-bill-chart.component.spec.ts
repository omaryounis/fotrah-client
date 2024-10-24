import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderPaymentBillChartComponent } from './calender-payment-bill-chart.component';

describe('CalenderPaymentBillChartComponent', () => {
  let component: CalenderPaymentBillChartComponent;
  let fixture: ComponentFixture<CalenderPaymentBillChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalenderPaymentBillChartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CalenderPaymentBillChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
