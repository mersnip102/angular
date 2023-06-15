import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLoaidoituongComponent } from './create-loaidoituong.component';

describe('CreateLoaidoituongComponent', () => {
  let component: CreateLoaidoituongComponent;
  let fixture: ComponentFixture<CreateLoaidoituongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLoaidoituongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLoaidoituongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
