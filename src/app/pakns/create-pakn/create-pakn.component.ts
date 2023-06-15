import { UploadImageComponent } from './../../../shared/components/upload-image/upload-image.component';
import { Const } from '@shared/constant/constant';
import { UploadMediaComponent } from './../../../shared/components/upload-media/upload-media.component';
import { CQueryableServiceServiceProxy, DVHCServiceServiceProxy, HistorysDto, MediaDto, MediaServiceServiceProxy, HistoryServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { ChangeDetectorRef, Component, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DoiTuongServiceProxy, OrganizationUnitServiceServiceProxy, PAKNDto, PAKNServiceProxy } from '@shared/service-proxies/service-proxies';
import { first, forEach } from 'lodash-es';
import { LongDateFormatKey } from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { ActivatedRoute } from '@angular/router';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import LayerGroup from 'ol/layer/Group';
import XYZ from 'ol/source/XYZ';
import LayerSwitcher from 'ol-layerswitcher';
import { Draw, Modify, Snap } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { transform } from 'ol/proj';
import WKT from 'ol/format/WKT';
import { getCenter } from 'ol/extent';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { UploadMultifileComponent } from '@shared/components/upload-multifile/upload-multifile.component';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-create-pakn',
  templateUrl: './create-pakn.component.html',
  styleUrls: ['./create-pakn.component.css']
})
export class CreatePaknComponent extends AppComponentBase implements OnInit, OnDestroy {
  @ViewChild('UploadImage', { static: true }) UploadImage: UploadImageComponent;
  @ViewChild('UploadVideo', { static: true }) UploadVideo: UploadMediaComponent;

  @ViewChild('UploadFile', { static: true }) UploadFile: UploadMultifileComponent;

  response: { dbPath: '' };
  responseFileImage: any[] = [];
  //video
  responseFileVideo: any[] = [];
  //file
  responseFile: any[] = [];
  saving = false;
  org: any;
  IsHidden: any;
  IsHiddenGuiBaoCao: any;
  orgstate: any;
  orgloaibaocao: any;
  orgtochuc: any;
  orgsTinh: any;
  orgsHuyen: any;
  orgsXa: any;
  orgSelectedTinh: number;
  orgSelectedHuyen: number;
  orgSelectedXa: number;
  items_tinh: any[] = [];
  items_huyen: any[] = [];
  items_xa: any[] = [];
  tochucid: number;
  pakn: PAKNDto = new PAKNDto();
  history: HistorysDto = new HistorysDto();
  media: MediaDto = new MediaDto();
  orgSelected: number;
  public doituongs: Array<Select2OptionData>;
  public tochucs: Array<Select2OptionData>;

  public tinhs: Array<Select2OptionData>;
  public huyens: Array<Select2OptionData>;
  public xas: Array<Select2OptionData>;
  orgSelectedState: number;
  orgSelectedLoaiBaoCao: number;
  orgSelectedDonViChuTri: number;
  orgSelectToChuc: any;
  public options: Options;
  @Output() onSave = new EventEmitter<any>();
  id: any;

  map: Map;
  layerSwitcher: LayerSwitcher;
  vectorEditSource = new VectorSource();
  vectorEditLayer = new VectorLayer();
  vectorZoomSource = new VectorSource();
  vectorZoom = new VectorLayer();
  vectorModify: any;
  drawPoint: any; snapPoint: any;

  bind_lat: number; //bind to html nhưng không thành công
  bind_lng: number; //bind to html nhưng không thành công
  items: any[] = [];
  //ckeditor
  public bsModalRef: BsModalRef;
  editor: Editor;
  htmlEditor = '';
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  constructor(
    injector: Injector,
    public _service: PAKNServiceProxy,
    public _serviceMedia: MediaServiceServiceProxy,
    private doituongservice: DoiTuongServiceProxy,
    private tochucservice: OrganizationUnitServiceServiceProxy,
    private route: ActivatedRoute,
    private dvhcservice: DVHCServiceServiceProxy,
    private historyservice: HistoryServiceProxy,
    private cQueryableService: CQueryableServiceServiceProxy,
    private cdr: ChangeDetectorRef
  ) {
    super(injector);
    this.options = {
      multiple: true,
      tags: true
    };
  }


  viewMap() {
    //vector layer tinh,huyen,xa zoomto
    this.vectorZoom = new VectorLayer({
      source: this.vectorZoomSource
    });
    //eidt point
    this.vectorEditLayer = new VectorLayer({
      source: this.vectorEditSource,
      properties: { title: 'Thêm điểm' },
      style: {
        'fill-color': 'rgba(138, 4, 4, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 5,
        'circle-fill-color': '#8a0404',
      },
      // style: new Style({
      //   fill: new Fill({
      //     color: 'rgba(255, 255, 255, 0.2)'
      //   }),
      //   stroke: new Stroke({
      //     color: '#ffcc33',
      //     width: 2
      //   }),
      //   image: new CircleStyle({
      //     radius: 7,
      //     fill: new Fill({
      //       color: '#ffcc33'
      //     })
      //   })
      // }),
      visible: true,
      opacity: 1,
    });

    this.map = new Map({
      layers: [
        new LayerGroup({
          properties: { title: 'Lớp nền' },
          layers: [
            new TileLayer({
              properties: { title: 'BanDoVN', type: 'base' },
              source: new XYZ({
                url: 'https://basemap.bandovn.vn/server/rest/services/' +
                  'bandovn/MapServer/tile/{z}/{y}/{x}',
              })
            })
          ]
        }),
        new LayerGroup({
          properties: { title: 'Overlays' },
          layers: [
            new TileLayer({
              properties: { title: 'OSM' },
              source: new OSM(),
              visible: true,
              opacity: 0.6,
            }),
            this.vectorEditLayer
          ]
        })
      ],
      target: 'ol-map',
      view: new View({
        center: [11779995, 2225440], //EPSG:3857 //nếu biết ở latlon thì phải tranform center: ol.proj.transform([-0.92, 52.96], 'EPSG:4326', 'EPSG:3857'),
        zoom: 6
      }),
    });
    this.layerSwitcher = new LayerSwitcher({
      activationMode: 'click',
      startActive: false,
      tipLabel: 'Show layer list', // Optional label for button
      collapseTipLabel: 'Hide layer list', // Optional label for button
      groupSelectStyle: 'children' // Can be 'children' [default], 'group' or 'none'
    })
    this.map.addControl(this.layerSwitcher);

    //add editPoint to map
    this.vectorModify = new Modify({ source: this.vectorEditSource });
    this.map.addInteraction(this.vectorModify);

    //add drawPoint to map
    this.drawPoint = new Draw({
      source: this.vectorEditSource,
      type: 'Point',

    });
    this.drawPoint.on('drawend', function (e) {
      /**
       * event on drawend
       */
      let coor = e.feature.getGeometry().getCoordinates(); //console.log(coor[0] +"_"+coor[1]);
      let coor_4326 = transform([coor[0], coor[1]], 'EPSG:3857', 'EPSG:4326'); //console.log(coor_4326[0] + "_" + coor_4326[1]);
      jQuery("#lat").val(coor_4326[0]);
      jQuery("#lng").val(coor_4326[1]);
    })
    // this.drawPoint.on('drawstart', function(e){
    //   this.clearPointAdded();
    // });
    this.map.addInteraction(this.drawPoint);

    //add snapPoint to map
    this.snapPoint = new Snap({ source: this.vectorEditSource });
    this.map.addInteraction(this.snapPoint);
  }

  clearPointAdded() {
    var features = this.vectorEditSource.getFeatures();
    features.forEach((feature) => {
      this.vectorEditSource.removeFeature(feature);
    });
    jQuery("#lat").val("");
    jQuery("#lng").val("");
  }

  zoomMap() {
    /**
     * Chọn tỉnh, huyện, xã. Click nút thì zoom tới bản đồ
     */
    console.log(this.orgSelectedXa + "_" + this.orgSelectedHuyen + "_" + this.orgSelectedTinh);
    if (this.orgSelectedXa != undefined && this.orgSelectedXa != 0) //zoom to xa
    {
      // this.cQueryableService.getPAKNGeom(this.id)
      this.cQueryableService.getXaGeom(this.orgSelectedXa.toString()).subscribe(rst => {
        let format = new WKT();
        let wkt = rst;
        let feature = format.readFeature(wkt, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        });
        var vectorZoomSourceFeature = this.vectorZoomSource.getFeatures();
        vectorZoomSourceFeature.forEach((feature) => {
          this.vectorZoomSource.removeFeature(feature);
        });
        this.vectorZoom.getSource().addFeature(feature);
        let ext = feature.getGeometry().getExtent();

        let center = getCenter(ext);
        this.map.setView(new View({
          center: [center[0], center[1]],
          zoom: 12
        }));
      })
    }
    else if (this.orgSelectedHuyen != undefined && this.orgSelectedHuyen != 0) //zoom to huyen
    {
      this.cQueryableService.getHuyenGeom(this.orgSelectedHuyen.toString()).subscribe(rst => {
        let format = new WKT();
        let wkt = rst;
        let feature = format.readFeature(wkt, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        });
        var vectorZoomSourceFeature = this.vectorZoomSource.getFeatures();
        vectorZoomSourceFeature.forEach((feature) => {
          this.vectorZoomSource.removeFeature(feature);
        });
        this.vectorZoom.getSource().addFeature(feature);
        let ext = feature.getGeometry().getExtent();

        let center = getCenter(ext);
        this.map.setView(new View({
          center: [center[0], center[1]],
          zoom: 12
        }));
      })
    }
    else if (this.orgSelectedTinh != undefined && this.orgSelectedTinh != 0) //zoom to tinh
    {
      this.cQueryableService.getTinhGeom(this.orgSelectedTinh.toString()).subscribe(rst => {
        let format = new WKT();
        let wkt = rst;
        let feature = format.readFeature(wkt, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        });
        var vectorZoomSourceFeature = this.vectorZoomSource.getFeatures();
        vectorZoomSourceFeature.forEach((feature) => {
          this.vectorZoomSource.removeFeature(feature);
        });
        this.vectorZoom.getSource().addFeature(feature);
        let ext = feature.getGeometry().getExtent();

        let center = getCenter(ext);
        this.map.setView(new View({
          center: [center[0], center[1]],
          zoom: 12
        }));
      })
    }
  }
  ngAfterContentChecked() {
    //this.changeDetector.detectChanges();
    this.cdr.detectChanges();
  }
  onMouseMove($event: PointerEvent) {
    var features = this.vectorEditSource.getFeatures();
    if (features.length > 0) {
      this.map.removeInteraction(this.drawPoint);
    }
    else {
      this.map.addInteraction(this.drawPoint);
    }

  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.viewMap();
    this.getDoiTuong();
    this.getState();
    // this.getToChuc();
    this.getAllToChucs();
    this.getLoaiBaoCao();
    this.getAllTinh();
    this.route.queryParams
      .subscribe(params => {
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id > 0) {
          this._service.getById(this.id).subscribe(rs => {
            this.UploadImage.onLoadImage(rs.images);
            this.UploadVideo.onLoadVideo(rs.medias);
            this.UploadFile.onLoadFile(rs.files);
            this.getToChucByDoiTuong(rs.doiTuongId);
            this.orgSelected = rs.doiTuongId;
            this.pakn = rs;
            this.htmlEditor = rs.content;
            this.orgSelectedState = rs.state;
            this.changeNoiDung();
            this.orgSelectedLoaiBaoCao = rs.type;
            this.appSession.user.id = rs.idUserSend;
            this.orgSelectedLoaiBaoCao = rs.type;
            if(rs.ma_dvhc_t !=undefined){
              this.getHuyenByTinh(rs.ma_dvhc_t);
              this.orgSelectedTinh = Number(rs.ma_dvhc_t);
            }
           if(rs.ma_dvhc_h!=undefined)
           {
            this.getXaByHuyen(rs.ma_dvhc_h);
            this.orgSelectedHuyen = Number(rs.ma_dvhc_h);
           }

           if(rs.ma_dvhc_x !=undefined){
            this.orgSelectedXa = Number(rs.ma_dvhc_x);
           }

            //alert(rs.organizationUnitId);
            this.orgSelectedDonViChuTri = rs.organizationUnitId;
            jQuery("#lat").val(rs.lat);
            jQuery("#lng").val(rs.lng);

            this.orgSelectToChuc = rs.paknOrg;
            // this._serviceMedia.getMediaPAKNID(this.id).subscribe(rs => {
            //   console.log("độ dài " + rs.length);
            //   for (var i = 0; i < rs.length; i++) {
            //     var medi = rs[i];
            //     console.log(medi.url);
            //   }
            // });

            //vẽ điểm trên bản đồ
            let coor_3857 = transform([rs.lat, rs.lng], 'EPSG:4326', 'EPSG:3857');
            //console.log("coor_3857:" + coor_3857[0] + "_" + coor_3857[1]);
            var feature = new Feature({
              geometry: new Point([
                coor_3857[0], coor_3857[1]
              ])
            });
            this.vectorEditSource.addFeature(feature);
          })
        }
        //Dungnb

      }
      );

  }

  changeNoiDung() {
    if (this.orgSelectedState != 0 && this.orgSelectedState != 4) {
      this.IsHidden = true;
    }
    else this.IsHidden = false;
  }

  HidenGuiBaoCao(trangthai) {
    if (trangthai > 0) {
      this.IsHiddenGuiBaoCao = true;
    }
    else this.IsHiddenGuiBaoCao = false;
  }

  ChangeOrg(event) {
    //console.log(this.orgSelectedState);
    this.changeNoiDung();
  }

  ChangeToChuc(event) {

    this.getToChucByDoiTuong(this.orgSelected);

  }

  getDoiTuong() {
    this.orgSelected = 0;
    //Lấy dữ liệu cây tổ chức
    this.doituongservice.getDoiTuongByUserIdDropdown(this.appSession.userId,1).subscribe(rs => {
      this.org = rs;
    })
  };



  getAllToChucs() {
    setTimeout(() => {
      this.tochucservice.getOrganizationUnitsViewDropdown(0).subscribe(rs => {
        rs.forEach(el => {
          this.items.push({ 'id': el.id.toString(), 'text': el.displayName })
        })
        this.tochucs = [...this.items];
      });
    }, 1000);

  }

  getToChucByDoiTuong(iddoituong) {
    // this.orgSelectToChuc = 0;
    //Lấy dữ liệu cây tổ chức
    this.tochucservice.getOrganizationUnitsByDoiTuongViewDropdown(iddoituong).subscribe(rs => {
      this.orgtochuc = rs;
      this.orgSelectedDonViChuTri = rs[0].id;
    })
  };

  getState() {
    this.orgSelectedState = 0;
    //Lấy dữ liệu cây tổ chức
    this._service.getStateDropdown().subscribe(rs => {
      this.orgstate = rs;

    })
  };

  getLoaiBaoCao() {
    this.orgSelectedLoaiBaoCao = 0;

    this._service.getLoaiBaoCaoDropdown().subscribe(rs => {
      this.orgloaibaocao = rs;

    })
  };


  saveHistory(idpakn) {
    this.history.nguoiTao = this.appSession.userId;
    this.id = this.route.snapshot.paramMap.get('id');
    this.history.paknId = idpakn;
    if (this.id > 0)
      this.history.noiDung = "Sửa thông tin báo cáo";
    else
      this.history.noiDung = "Tạo mới báo cáo";
    this.history.trangThai = 0;
    this.historyservice.insert(this.history).subscribe(
      (rs) => {
        this.onSave.emit();
        location.href = "app/pakns";
      },
      () => {
        this.saving = false;
      }
    );
  }

  save() {

    this.saving = true;
    this.pakn.doiTuongId = this.orgSelected;
    this.pakn.state = 0; // là m
    this.pakn.paknOrg = this.orgSelectToChuc;
    var lat = parseFloat(jQuery("#lat").val().toString()) || 0;
    var lng = parseFloat(jQuery("#lng").val().toString()) || 0;
    this.pakn.type = this.orgSelectedLoaiBaoCao;
    this.pakn.organizationUnitId = this.orgSelectedDonViChuTri;
    this.pakn.idUserSend = this.appSession.user.id;
    this.pakn.lat = lat;
    this.pakn.lng = lng;
    this.pakn.content = this.htmlEditor;

    if (this.orgSelectedTinh == 0) this.pakn.ma_dvhc_t = "";
    else this.pakn.ma_dvhc_t = this.orgSelectedTinh.toString();

    if (this.orgSelectedHuyen == 0) this.pakn.ma_dvhc_h = "";
    else this.pakn.ma_dvhc_h = this.orgSelectedHuyen.toString();

    if (this.orgSelectedXa == 0) this.pakn.ma_dvhc_x = "";
    else this.pakn.ma_dvhc_x = this.orgSelectedXa.toString();

    if (this.id == null) {

      var ids = this._service.insert(this.pakn).subscribe(
        (rs) => {
          this.saveImage(rs);
          this.saveVideo(rs);
          this.saveFile(rs);
          this.notify.info(this.l('Thêm mới báo cáo thành công!'));
          this.saveHistory(rs);
          // this.bsModalRef.hide();
          this.onSave.emit();
          // location.href = "app/pakns";
        },
        () => {
          this.saving = false;
        }
      );
    }
    else {
      this._service.update(this.pakn).subscribe(
        () => {
          this.notify.info(this.l('Cập nhật báo cáo thành công'));
          this.saveImage(this.id);
          this.saveVideo(this.id);
          this.saveFile(this.id);
          this.saveHistory(this.id);
          //  location.href = "app/pakns";
          this.onSave.emit();
        },
        () => {
          this.saving = false;
        }
      );
    }

  }

  uploadFinished = (event) => {
    this.responseFileImage.push(event);
    console.log(this.responseFileImage);

  }
  uploadFinishedVideo = (event) => {
    this.responseFileVideo.push(event);
  }
  uploadFinishedFile = (event) => {
    this.responseFile.push(event);
  }

  saveImage = (idpakn) => {
    for (var i = 0; i < this.responseFileImage.length; i++) {
      this.media.paknId = idpakn;
      this.media.url = this.responseFileImage[i][i].pathFile;
      this.media.type = Const.type_image;
      this._serviceMedia.insert(this.media).subscribe(
        () => {
          this.onSave.emit();
        },
        () => {
          this.saving = false;
        });
    }
  }
  saveVideo = (idpakn) => {
    for (var i = 0; i < this.responseFileVideo.length; i++) {
      this.media.paknId = idpakn;
      this.media.url = this.responseFileVideo[i][i].pathFile;
      this.media.type = Const.type_video;//video
      this._serviceMedia.insert(this.media).subscribe(
        () => {
          this.onSave.emit();
        },
        () => {
          this.saving = false;
        });
    }
  }
  saveFile = (idpakn) => {
    for (var i = 0; i < this.responseFile.length; i++) {
      this.media.paknId = idpakn;
      this.media.url = this.responseFile[i][i].pathFile;
      this.media.type = Const.type_other;
      this._serviceMedia.insert(this.media).subscribe(
        () => {
          this.onSave.emit();
        },
        () => {
          this.saving = false;
        });
    }
  }

  // Dungnb code
  getAllTinh() {
    this.orgSelectedTinh = 0;
    this.orgSelectedHuyen = 0;
    this.orgSelectedXa = 0;
    this.dvhcservice.getTinh().subscribe(rs => {
      this.orgsTinh = rs;
    })
  };
  getHuyenByTinh(ma_tinh) {
    this.orgSelectedHuyen = 0;
    this.dvhcservice.getHuyen(ma_tinh).subscribe(rs => {
      this.orgsHuyen = rs;
    })
  }
  getXaByHuyen(ma_huyen) {
    this.orgSelectedXa = 0;
    this.dvhcservice.getXa(ma_huyen).subscribe(rs => {
      this.orgsXa = rs;
    })
  }
  ChangeOrgTinh(ma_tinh) {
    if (this.orgSelectedTinh != 0) {
      this.getHuyenByTinh(ma_tinh);
      // console.log(ma_tinh)
    }
  }
  ChangeOrgHuyen(ma_huyen) {
    if (this.orgSelectedHuyen != 0) {
      this.getXaByHuyen(ma_huyen);
      // console.log(ma_huyen)
    }
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
