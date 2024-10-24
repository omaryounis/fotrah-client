import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanComponent } from './can.component';

describe('CanComponent', () => {
  let component: CanComponent;
  let fixture: ComponentFixture<CanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
