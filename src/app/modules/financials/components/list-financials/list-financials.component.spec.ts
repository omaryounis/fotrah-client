import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFinancialsComponent } from './list-financials.component';

describe('ListFinancialsComponent', () => {
  let component: ListFinancialsComponent;
  let fixture: ComponentFixture<ListFinancialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListFinancialsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListFinancialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
