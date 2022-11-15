/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DayViewComponent } from './day-view.component';

describe('DayViewComponent', () => {
  let component: DayViewComponent;
  let fixture: ComponentFixture<DayViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
