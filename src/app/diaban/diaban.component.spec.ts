import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiabanComponent } from './diaban.component';

describe('DiabanComponent', () => {
  let component: DiabanComponent;
  let fixture: ComponentFixture<DiabanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiabanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiabanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
