import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeFinancialStatus } from './change-financial-status.component';



describe('ChangeFinancialStatus', () => {
  let component: ChangeFinancialStatus;
  let fixture: ComponentFixture<ChangeFinancialStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeFinancialStatus]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeFinancialStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
