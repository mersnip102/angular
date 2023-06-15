import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDoituongDuyetComponent } from './user-doituong-duyet.component';

describe('UserDoituongDuyetComponent', () => {
  let component: UserDoituongDuyetComponent;
  let fixture: ComponentFixture<UserDoituongDuyetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDoituongDuyetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDoituongDuyetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
