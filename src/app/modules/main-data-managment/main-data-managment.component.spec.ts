import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDataManagmentComponent } from './main-data-managment.component';

describe('MainDataManagmentComponent', () => {
  let component: MainDataManagmentComponent;
  let fixture: ComponentFixture<MainDataManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainDataManagmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainDataManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
