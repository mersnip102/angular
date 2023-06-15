import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaidoituongComponent } from './loaidoituong.component';

describe('LoaidoituongComponent', () => {
  let component: LoaidoituongComponent;
  let fixture: ComponentFixture<LoaidoituongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaidoituongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaidoituongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
