import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitmentRatioComponent } from './commitment-ratio.component';

describe('CommitmentRatioComponent', () => {
  let component: CommitmentRatioComponent;
  let fixture: ComponentFixture<CommitmentRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitmentRatioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommitmentRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
