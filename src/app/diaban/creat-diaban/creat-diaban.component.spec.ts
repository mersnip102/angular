import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatDiabanComponent } from './creat-diaban.component';

describe('CreatDiabanComponent', () => {
  let component: CreatDiabanComponent;
  let fixture: ComponentFixture<CreatDiabanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatDiabanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatDiabanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
