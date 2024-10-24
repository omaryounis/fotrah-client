import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicBillInqueryComponent } from './public-bill-inquery.component';

describe('PublicBillInqueryComponent', () => {
  let component: PublicBillInqueryComponent;
  let fixture: ComponentFixture<PublicBillInqueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicBillInqueryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicBillInqueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
