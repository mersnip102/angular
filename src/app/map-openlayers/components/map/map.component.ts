/**JUST pass map element */
import { Component, OnInit, ChangeDetectionStrategy, Input, ElementRef } from '@angular/core';
import Map from 'ol/Map';

@Component({
  selector: 'app-map',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  @Input() map: Map;
  constructor(private elementRef: ElementRef) {
  }
  ngOnInit() {
    this.map.setTarget(this.elementRef.nativeElement);
  }
}