import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityWorkflowComponent } from './quality-workflow.component';

describe('QualityWorkflowComponent', () => {
  let component: QualityWorkflowComponent;
  let fixture: ComponentFixture<QualityWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualityWorkflowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QualityWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
