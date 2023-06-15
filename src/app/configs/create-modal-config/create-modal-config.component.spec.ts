import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModalConfigComponent } from './create-modal-config.component';

describe('CreateModalConfigComponent', () => {
  let component: CreateModalConfigComponent;
  let fixture: ComponentFixture<CreateModalConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateModalConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModalConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
