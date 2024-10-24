import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByIdentityFormComponent } from './search-by-identity-form.component';

describe('SearchByIdentityComponent', () => {
  let component: SearchByIdentityFormComponent;
  let fixture: ComponentFixture<SearchByIdentityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchByIdentityFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SearchByIdentityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
