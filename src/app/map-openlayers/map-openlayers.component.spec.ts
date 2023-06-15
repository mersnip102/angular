import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapOpenlayersComponent } from './map-openlayers.component';

describe('MapOpenlayersComponent', () => {
  let component: MapOpenlayersComponent;
  let fixture: ComponentFixture<MapOpenlayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapOpenlayersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapOpenlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
