import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMunicipalityComponent } from './show-municipality.component';

describe('ShowMunicipalityComponent', () => {
  let component: ShowMunicipalityComponent;
  let fixture: ComponentFixture<ShowMunicipalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowMunicipalityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowMunicipalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
