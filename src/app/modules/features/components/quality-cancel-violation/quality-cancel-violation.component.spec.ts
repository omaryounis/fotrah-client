import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityCancelViolationComponent } from './quality-cancel-violation.component';

describe('QualityCancelViolationComponent', () => {
  let component: QualityCancelViolationComponent;
  let fixture: ComponentFixture<QualityCancelViolationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualityCancelViolationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QualityCancelViolationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
