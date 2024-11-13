import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListObjectionsMissionsComponent } from './list-objections-tasks.component';

describe('ListObjectionsMissionsComponent', () => {
  let component: ListObjectionsMissionsComponent;
  let fixture: ComponentFixture<ListObjectionsMissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListObjectionsMissionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListObjectionsMissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
