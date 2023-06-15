import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdvhcComponent } from './userdvhc.component';

describe('UserdvhcComponent', () => {
  let component: UserdvhcComponent;
  let fixture: ComponentFixture<UserdvhcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserdvhcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserdvhcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
