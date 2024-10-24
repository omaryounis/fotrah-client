import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStatusActivityComponent } from './change-status-activity.component';

describe('ChangeStatusActivityComponent', () => {
  let component: ChangeStatusActivityComponent;
  let fixture: ComponentFixture<ChangeStatusActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeStatusActivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeStatusActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
