import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListObjectionsComponent } from './list-objections.component';

describe('ListObjectionsComponent', () => {
  let component: ListObjectionsComponent;
  let fixture: ComponentFixture<ListObjectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListObjectionsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListObjectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
