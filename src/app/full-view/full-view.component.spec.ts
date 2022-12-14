/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FullViewComponent } from './full-view.component';

describe('FullViewComponent', () => {
  let component: FullViewComponent;
  let fixture: ComponentFixture<FullViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
