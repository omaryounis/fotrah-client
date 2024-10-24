import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicBillDetailsComponent } from './public-bill-details.component';

describe('PublicBillDetailsComponent', () => {
  let component: PublicBillDetailsComponent;
  let fixture: ComponentFixture<PublicBillDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicBillDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicBillDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
