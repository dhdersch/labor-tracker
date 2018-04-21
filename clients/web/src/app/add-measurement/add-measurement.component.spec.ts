import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMeasurementComponent } from './add-measurement.component';

describe('AddMeasurementComponent', () => {
  let component: AddMeasurementComponent;
  let fixture: ComponentFixture<AddMeasurementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMeasurementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
