import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NhacviecComponent } from './nhacviec.component';

describe('NhacviecComponent', () => {
  let component: NhacviecComponent;
  let fixture: ComponentFixture<NhacviecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NhacviecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NhacviecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
