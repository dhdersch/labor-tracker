import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartogramComponent } from './partogram.component';

describe('PartogramComponent', () => {
  let component: PartogramComponent;
  let fixture: ComponentFixture<PartogramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartogramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
