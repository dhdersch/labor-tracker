import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPartogramComponent } from './add-partogram.component';

describe('AddPartogramComponent', () => {
  let component: AddPartogramComponent;
  let fixture: ComponentFixture<AddPartogramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPartogramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPartogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
