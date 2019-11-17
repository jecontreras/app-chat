import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubastasComponent } from './subastas.component';

describe('SubastasComponent', () => {
  let component: SubastasComponent;
  let fixture: ComponentFixture<SubastasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubastasComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubastasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
