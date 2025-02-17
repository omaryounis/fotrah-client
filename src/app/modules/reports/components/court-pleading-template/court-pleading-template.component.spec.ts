import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtPleadingTemplateComponent } from './court-pleading-template.component';

describe('CourtPleadingTemplateComponent', () => {
  let component: CourtPleadingTemplateComponent;
  let fixture: ComponentFixture<CourtPleadingTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourtPleadingTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourtPleadingTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
