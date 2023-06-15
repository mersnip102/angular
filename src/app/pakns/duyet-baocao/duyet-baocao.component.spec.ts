import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuyetBaocaoComponent } from './duyet-baocao.component';

describe('DuyetBaocaoComponent', () => {
  let component: DuyetBaocaoComponent;
  let fixture: ComponentFixture<DuyetBaocaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuyetBaocaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuyetBaocaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
