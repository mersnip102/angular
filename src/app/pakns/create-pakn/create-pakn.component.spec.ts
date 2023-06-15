import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaknComponent } from './create-pakn.component';

describe('CreatePaknComponent', () => {
  let component: CreatePaknComponent;
  let fixture: ComponentFixture<CreatePaknComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePaknComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePaknComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
