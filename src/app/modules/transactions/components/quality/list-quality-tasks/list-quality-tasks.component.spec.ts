import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListQualityTasksComponent } from './list-quality-tasks.component';

describe('ListQualityTasksComponent', () => {
  let component: ListQualityTasksComponent;
  let fixture: ComponentFixture<ListQualityTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListQualityTasksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListQualityTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
