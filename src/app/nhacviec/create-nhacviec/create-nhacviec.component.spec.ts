import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNhacviecComponent } from './create-nhacviec.component';

describe('CreateNhacviecComponent', () => {
  let component: CreateNhacviecComponent;
  let fixture: ComponentFixture<CreateNhacviecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNhacviecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNhacviecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
