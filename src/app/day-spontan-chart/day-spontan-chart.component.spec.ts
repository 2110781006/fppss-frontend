import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaySpontanChartComponent } from './day-spontan-chart.component';

describe('DaySpontanChartComponent', () => {
  let component: DaySpontanChartComponent;
  let fixture: ComponentFixture<DaySpontanChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaySpontanChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaySpontanChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
