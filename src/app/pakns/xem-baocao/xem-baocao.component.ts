import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DoiTuongServiceProxy, OrganizationUnitServiceServiceProxy, PAKNDto, PAKNServiceProxy ,DVHCServiceServiceProxy,SuKienServiceServiceProxy, SuKien} from '@shared/service-proxies/service-proxies';
import { forEach } from 'lodash-es';
import { LongDateFormatKey } from 'moment';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { ActivatedRoute } from '@angular/router'
import { environment } from 'environments/environment';


import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import LayerGroup from 'ol/layer/Group';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import LayerSwitcher from 'ol-layerswitcher';
import { transform } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { title } from 'process';
import { Overlay } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Projection, toLonLat } from 'ol/proj';
import { isBuffer, result } from 'lodash-es';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import WKT from 'ol/format/WKT';
import { getCenter } from 'ol/extent';


@Component({
  selector: 'app-xem-baocao',
  templateUrl: './xem-baocao.component.html',
  styleUrls: ['./xem-baocao.component.css']
})
export class XemBaocaoComponent extends AppComponentBase implements OnInit {
  saving = false;
  org: any;
  IsHidden: any;
  orgstate: any;
  orgtochuc: any;
  tochucid: number;
  pakn: PAKNDto = new PAKNDto();
  orgSelected: string;
  public doituongs: Array<Select2OptionData>;
  orgSelectedLoaiBaoCao: string;
  orgloaibaocao: any;
  orgSelectedState: string;
  orgSelectToChuc: any;
  guibaocao: boolean;
  duyetbaocao: boolean;
  tentinh:string;
  tenhuyen:string;
  orgSelectedSuKien:string;
  tenxa:string;
  public options: Options;
  public tochucs: Array<Select2OptionData>;
  orgSelectedDonViChuTri: string;
  @Output() onSave = new EventEmitter<any>();
  id: any; burl:any;
  url:any;


  //map
  map: Map;
  layerSwitcher: LayerSwitcher;
  source_bc_point:TileWMS;
  view_map: View;
  overlay:Overlay;
  vectorSource = new VectorSource();
  vectorLayer = new VectorLayer();

  constructor(

    injector: Injector,
    public _service: PAKNServiceProxy,
    private doituongservice: DoiTuongServiceProxy,
    private tochucservice: OrganizationUnitServiceServiceProxy,
    private route: ActivatedRoute,
    private dvhcservice: DVHCServiceServiceProxy,
    private sukienservice:SuKienServiceServiceProxy
  ) {
    super(injector);
    this.url = environment.baseUrlMedia;

  }
  ngOnInit(): void {

    this.route.queryParams
      .subscribe(params => {

        this.id = this.route.snapshot.paramMap.get('id');
        this.burl = params.burl;
        if (this.id > 0) {
          this._service.getById(this.id).subscribe(rs => {
            //console.log(rs);
            this.getLoaiBaoCaoById(rs.type);
            //this.getDoiTuongByID(rs.doiTuongId);
            this.gettoChucById(rs.organizationUnitId);
            this.pakn = rs;
            this.getTrangThaiById(rs.state);
            this.orgSelectToChuc = rs.paknOrg;
            this.getToChucLienQuanByPaknId(rs.id);
            this.getTenTinhByMa(rs.ma_dvhc_t);
            this.getTenHuyenhByMa(rs.ma_dvhc_h);
            this.getSuKienByID(rs.suKienId);
            this.getTenXaByMa(rs.ma_dvhc_x);
            this.orgSelected = rs.tenDoiTuong;
            this.getRoleGuiBaoCao();
            //vẽ điểm trên bản đồ
            let coor_3857 = transform([rs.lng, rs.lat], 'EPSG:4326', 'EPSG:3857');
            var feature = new Feature({
              geometry: new Point([
                coor_3857[0], coor_3857[1]
              ])
            });
            this.vectorSource.addFeature(feature);
          })
        }
      });

    this.ShowMap();
  }
  getLoaiBaoCaoById(id) {
    if (id == 0)
      this.orgSelectedLoaiBaoCao = "Định kỳ";
    else this.orgSelectedLoaiBaoCao = "Đột xuất";
  }

  getTrangThaiById(id) {
    this._service.getTrangThaiByID(id).subscribe(rs => {

      this.orgSelectedState = rs;
    })
  }
  getRoleGuiBaoCao() {

    this._service.getRoleGuiBaoCao(this.appSession.userId).subscribe(rs => {
      this.guibaocao = rs;
      //console.log(this.guibaocao);
    })
  };
  getToChucLienQuanByPaknId(id) {
    // this.orgSelected = 0;
    //Lấy dữ liệu cây tổ chức
    this._service.getToChucNameByPAKNID(id).subscribe(rs => {
      //this.org = rs;
      this.orgSelectToChuc = rs;
    })
  };

  getDoiTuongByID(id) {
    this.doituongservice.getById(id).subscribe(rs => {
      this.orgSelected = rs.name;

    })
  }

getSuKienByID(id){
  if(id>0){
  this.sukienservice.getById(id).subscribe(rs => {
    this.orgSelectedSuKien = rs.tenSuKien;

  })
}
}

  getTenTinhByMa(matinh) {
    this.dvhcservice.getTinhByMa(matinh).subscribe(rs => {
      this.tentinh = rs;

    })
  }

  getTenHuyenhByMa(mahuyen) {
    this.dvhcservice.getHuyenByMa(mahuyen).subscribe(rs => {
      this.tenhuyen = rs;

    })
  }
  getTenXaByMa(maxa) {
    this.dvhcservice.getXaByMa(maxa).subscribe(rs => {
      this.tenxa = rs;

    })
  }

  gettoChucById(id) {
    this.tochucservice.getOrganizationUnitsById(id).subscribe(rs => {

      this.orgSelectedDonViChuTri = rs.displayName;
    })
  }
  public createImgPath = (serverPath: string) => {
    return this.url+ serverPath;
  }
  public SplitFile(pathFile:string):string
  {
    let str =pathFile.split('\\')[2]
    return str;

  }

  ShowMap() {
    this.view_map = new View({
      center: [11779995, 2225440],
      zoom: 6
    });

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      properties: { title: 'Điểm báo cáo' },
      style: {
        'fill-color': 'rgba(138, 4, 4, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 5,
        'circle-fill-color': '#8a0404',
      },
      visible: true,
      opacity: 1,
    });

    this.map = new Map({
      view: this.view_map,
      layers: [
        new LayerGroup({
          properties:{title:'Lớp nền'},
          layers:[
            new TileLayer({
              properties:{title:'BanDoVN', type:'base'},
              source:new XYZ({
                url:'https://basemap.bandovn.vn/server/rest/services/' +
                'bandovn/MapServer/tile/{z}/{y}/{x}',
              })
            })
          ]
        }),
        new LayerGroup({
          properties:{title:'Chồng xếp'},
          layers:[
            new TileLayer({
              properties:{title:'OSM'},
              source: new OSM(),
              visible: true,
              opacity:0.6,
            }),
            this.vectorLayer
          ]
        })
      ],
      target: 'ol-map'
    });

    this.layerSwitcher = new LayerSwitcher({
      activationMode:'click',
      startActive:false,
      tipLabel: 'Show layer list',
      collapseTipLabel: 'Hide layer list',
      groupSelectStyle: 'children'
    })
    this.map.addControl(this.layerSwitcher);
  }
}




