import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQualityFormComponent } from './user-quality-form.component';

describe('UserQualityFormComponent', () => {
  let component: UserQualityFormComponent;
  let fixture: ComponentFixture<UserQualityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserQualityFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserQualityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
