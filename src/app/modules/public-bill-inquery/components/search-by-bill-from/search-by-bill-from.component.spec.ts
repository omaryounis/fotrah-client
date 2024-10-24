import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByBillFromComponent } from './search-by-bill-from.component';

describe('SearchByBillFromComponent', () => {
  let component: SearchByBillFromComponent;
  let fixture: ComponentFixture<SearchByBillFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchByBillFromComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchByBillFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
