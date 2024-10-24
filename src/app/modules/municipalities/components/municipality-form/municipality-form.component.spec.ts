import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipalityFormComponent } from './municipality-form.component';

describe('MunicipalityFormComponent', () => {
  let component: MunicipalityFormComponent;
  let fixture: ComponentFixture<MunicipalityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MunicipalityFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MunicipalityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
