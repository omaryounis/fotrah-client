import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMunicipalityComponent } from './create-municipality.component';

describe('CreateMunicipalityComponent', () => {
  let component: CreateMunicipalityComponent;
  let fixture: ComponentFixture<CreateMunicipalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMunicipalityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateMunicipalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
