import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDoituongXemComponent } from './user-doituong-xem.component';

describe('UserDoituongXemComponent', () => {
  let component: UserDoituongXemComponent;
  let fixture: ComponentFixture<UserDoituongXemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDoituongXemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDoituongXemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
