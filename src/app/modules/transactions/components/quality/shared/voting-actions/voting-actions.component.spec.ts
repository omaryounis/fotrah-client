import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingActionsComponent } from './voting-actions.component';

describe('VotingActionsComponent', () => {
  let component: VotingActionsComponent;
  let fixture: ComponentFixture<VotingActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotingActionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VotingActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
