import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskConfirmationComponent } from './task-confirmation.component';

describe('TaskConfirmationComponent', () => {
  let component: TaskConfirmationComponent;
  let fixture: ComponentFixture<TaskConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
