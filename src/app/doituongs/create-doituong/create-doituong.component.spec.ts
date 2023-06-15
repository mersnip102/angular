import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDoituongComponent } from './create-doituong.component';

describe('CreateDoituongComponent', () => {
  let component: CreateDoituongComponent;
  let fixture: ComponentFixture<CreateDoituongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDoituongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDoituongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
