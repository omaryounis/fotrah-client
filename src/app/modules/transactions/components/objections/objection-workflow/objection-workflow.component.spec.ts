import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectionWorkflowComponent } from './objection-workflow.component';

describe('ObjectionWorkflowComponent', () => {
  let component: ObjectionWorkflowComponent;
  let fixture: ComponentFixture<ObjectionWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectionWorkflowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ObjectionWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
