import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUserQualityTasksComponent } from './list-user-quality-tasks.component';

describe('ListUserQualityTasksComponent', () => {
  let component: ListUserQualityTasksComponent;
  let fixture: ComponentFixture<ListUserQualityTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUserQualityTasksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListUserQualityTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
