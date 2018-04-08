import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartogramListComponent } from './partogram-list.component';

describe('PartogramListComponent', () => {
  let component: PartogramListComponent;
  let fixture: ComponentFixture<PartogramListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartogramListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartogramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
