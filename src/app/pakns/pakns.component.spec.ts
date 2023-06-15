import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaknsComponent } from './pakns.component';

describe('PaknsComponent', () => {
  let component: PaknsComponent;
  let fixture: ComponentFixture<PaknsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaknsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaknsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
