import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustedProvidersListComponent } from './trusted-providers-list.component';

describe('TrustedProvidersListComponent', () => {
  let component: TrustedProvidersListComponent;
  let fixture: ComponentFixture<TrustedProvidersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrustedProvidersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustedProvidersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
