import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNhiemvuComponent } from './create-nhiemvu.component';

describe('CreateNhiemvuComponent', () => {
  let component: CreateNhiemvuComponent;
  let fixture: ComponentFixture<CreateNhiemvuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNhiemvuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNhiemvuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
