import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudModalComponent } from './crud-modal.component';

describe('CrudModalComponent', () => {
  let component: CrudModalComponent;
  let fixture: ComponentFixture<CrudModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
