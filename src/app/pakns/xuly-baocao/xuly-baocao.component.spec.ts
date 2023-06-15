import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XulyBaocaoComponent } from './xuly-baocao.component';

describe('XulyBaocaoComponent', () => {
  let component: XulyBaocaoComponent;
  let fixture: ComponentFixture<XulyBaocaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XulyBaocaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XulyBaocaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
