import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NhiemvuComponent } from './nhiemvu.component';

describe('NhiemvuComponent', () => {
  let component: NhiemvuComponent;
  let fixture: ComponentFixture<NhiemvuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NhiemvuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NhiemvuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
