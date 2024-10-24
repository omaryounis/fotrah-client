import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFeaturesComponent } from './sub-features.component';

describe('SubFeaturesComponent', () => {
  let component: SubFeaturesComponent;
  let fixture: ComponentFixture<SubFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubFeaturesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
