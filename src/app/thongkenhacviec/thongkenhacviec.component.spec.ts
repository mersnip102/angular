import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongkenhacviecComponent } from './thongkenhacviec.component';

describe('ThongkenhacviecComponent', () => {
  let component: ThongkenhacviecComponent;
  let fixture: ComponentFixture<ThongkenhacviecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongkenhacviecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongkenhacviecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
