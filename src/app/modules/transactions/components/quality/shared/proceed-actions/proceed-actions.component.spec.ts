import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceedActionsComponent } from './proceed-actions.component';

describe('ProceedActionsComponent', () => {
  let component: ProceedActionsComponent;
  let fixture: ComponentFixture<ProceedActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProceedActionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProceedActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
