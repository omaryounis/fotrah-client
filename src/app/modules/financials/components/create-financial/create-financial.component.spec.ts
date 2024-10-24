import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFinancialComponent } from './create-financial.component';

describe('CreateFinancialComponent', () => {
  let component: CreateFinancialComponent;
  let fixture: ComponentFixture<CreateFinancialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFinancialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
