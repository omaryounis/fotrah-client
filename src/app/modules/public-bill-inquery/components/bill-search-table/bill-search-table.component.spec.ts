import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillSearchTableComponent } from './bill-search-table.component';

describe('BillSearchTableComponent', () => {
  let component: BillSearchTableComponent;
  let fixture: ComponentFixture<BillSearchTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillSearchTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillSearchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
