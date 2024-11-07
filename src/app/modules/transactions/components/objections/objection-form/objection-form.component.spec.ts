import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectionFormComponent } from './objection-form.component';

describe('ObjectionFormComponent', () => {
  let component: ObjectionFormComponent;
  let fixture: ComponentFixture<ObjectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectionFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ObjectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
