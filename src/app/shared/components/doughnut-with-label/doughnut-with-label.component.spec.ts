import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoughnutWithLabelComponent } from './doughnut-with-label.component';

describe('DoughnutWithLabelComponent', () => {
  let component: DoughnutWithLabelComponent;
  let fixture: ComponentFixture<DoughnutWithLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoughnutWithLabelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoughnutWithLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
