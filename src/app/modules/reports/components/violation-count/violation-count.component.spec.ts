import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ViolationCountComponent } from "./violation-count.component";

describe("ViolationCountChartComponent", () => {
  let component: ViolationCountComponent;
  let fixture: ComponentFixture<ViolationCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViolationCountComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViolationCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
