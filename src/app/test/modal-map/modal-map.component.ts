import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Overlay, View } from 'ol';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import Map from 'ol/Map';
import LayerSwitcher from 'ol-layerswitcher';
import { toLonLat } from 'ol/proj';
import { setTimeout } from 'timers';
@Component({
  selector: 'app-modal-map',
  templateUrl: './modal-map.component.html',
  styleUrls: ['./modal-map.component.css']
})
export class ModalMapComponent implements OnInit {
  map: Map;
  layerSwitcher: LayerSwitcher;
  add_point_x:string='';
  add_point_y:string='';
  saving = false;
  constructor(  public bsModalRef: BsModalRef,) {
  }

  ngOnInit(): void {



  }
  ngAfterViewInit(){
    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 1,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'ol-map'
    });
  }
save()
{

}
}
