import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralBillChartComponent } from './general-bill-chart.component';

describe('GeneralBillChartComponent', () => {
  let component: GeneralBillChartComponent;
  let fixture: ComponentFixture<GeneralBillChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralBillChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneralBillChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
