import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoituongsComponent } from './doituongs.component';

describe('DoituongsComponent', () => {
  let component: DoituongsComponent;
  let fixture: ComponentFixture<DoituongsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoituongsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoituongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
