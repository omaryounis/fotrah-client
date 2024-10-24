import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMunicipalityStatusComponent } from './change-municipality-status.component';

describe('ChangeMunicipalityStatusComponent', () => {
  let component: ChangeMunicipalityStatusComponent;
  let fixture: ComponentFixture<ChangeMunicipalityStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeMunicipalityStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeMunicipalityStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
