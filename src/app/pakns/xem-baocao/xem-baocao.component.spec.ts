import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XemBaocaoComponent } from './xem-baocao.component';

describe('XemBaocaoComponent', () => {
  let component: XemBaocaoComponent;
  let fixture: ComponentFixture<XemBaocaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XemBaocaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XemBaocaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
