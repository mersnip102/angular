import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDoituongComponent } from './user-doituong.component';

describe('UserDoituongComponent', () => {
  let component: UserDoituongComponent;
  let fixture: ComponentFixture<UserDoituongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDoituongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDoituongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
