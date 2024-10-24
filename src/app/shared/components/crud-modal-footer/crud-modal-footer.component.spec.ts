import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudModalFooterComponent } from './crud-modal-footer.component';

describe('CrudModalFooterComponent', () => {
  let component: CrudModalFooterComponent;
  let fixture: ComponentFixture<CrudModalFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudModalFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudModalFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
