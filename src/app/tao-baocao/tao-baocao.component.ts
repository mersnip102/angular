import { LoaiBaoCaoPAKN } from "./../../shared/constant/constant";

import { Const } from "@shared/constant/constant";

import {
  CQueryableServiceServiceProxy,
  DVHCServiceServiceProxy,
  MediaDto,
  MediaServiceServiceProxy,
  SuKienServiceServiceProxy,
  HistorysDto,
  HistoryServiceProxy,
  HistoryAddNguoiTaoDto,
} from "@shared/service-proxies/service-proxies";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import {
  DoiTuongServiceProxy,
  OrganizationUnitServiceServiceProxy,
  PAKNDto,
  PAKNServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { first, forEach, toNumber } from "lodash-es";
import { LongDateFormatKey, Moment } from "moment";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Select2OptionData } from "ng-select2";
import { Options } from "select2";
import { ActivatedRoute, Router } from "@angular/router";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import LayerGroup from "ol/layer/Group";
import XYZ from "ol/source/XYZ";
import LayerSwitcher from "ol-layerswitcher";
import { Draw, Modify, Snap } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { transform } from "ol/proj";
import WKT from "ol/format/WKT";
import { getCenter } from "ol/extent";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { UploadMultifileComponent } from "@shared/components/upload-multifile/upload-multifile.component";
import { Editor, Toolbar } from "ngx-editor";
import { UploadImageComponent } from "@shared/components/upload-image/upload-image.component";
import { UploadMediaComponent } from "@shared/components/upload-media/upload-media.component";
import * as moment from "moment";
import {
  resultList,
  RxSpeechRecognitionService,
} from "@kamiazya/ngx-speech-recognition";

@Component({
  selector: "app-tao-baocao",
  templateUrl: "./tao-baocao.component.html",
  styleUrls: ["./tao-baocao.component.css"],
})
export class TaoBaocaoComponent
  extends AppComponentBase
  implements OnInit, OnDestroy
{
  @ViewChild("UploadImage", { static: true }) UploadImage: UploadImageComponent;
  @ViewChild("UploadVideo", { static: true }) UploadVideo: UploadMediaComponent;

  @ViewChild("UploadFile", { static: true })
  UploadFile: UploadMultifileComponent;

  response: { dbPath: "" };
  responseFileImage: any[] = [];
  //video
  responseFileVideo: any[] = [];
  //file
  responseFile: any[] = [];
  saving = false;
  org: any;
  orgSuKien: any;
  IsHidden: any;
  IsHiddenGuiBaoCao: any;
  orgstate: any;
  orgloaibaocao: any;
  orgtochuc: any;
  orgsTinh: any;
  orgsHuyen: any;
  orgsXa: any;
  orgSelectedTinh: string;
  orgSelectedHuyen: string;
  orgSelectedXa: string;
  orgSuKienSelect: number;
  items_tinh: any[] = [];
  items_huyen: any[] = [];
  items_xa: any[] = [];
  tochucid: number;
  pakn: PAKNDto = new PAKNDto();
  media: MediaDto = new MediaDto();
  orgSelected: number;
  public doituongs: Array<Select2OptionData>;
  public tochucs: Array<Select2OptionData>;
  history: HistorysDto = new HistorysDto();
  historys: HistoryAddNguoiTaoDto[] = [];
  public tinhs: Array<Select2OptionData>;
  public huyens: Array<Select2OptionData>;
  public xas: Array<Select2OptionData>;
  orgSelectedState: number;
  orgSelectedLoaiBaoCao: number;
  orgSelectedDonViChuTri: number = 0;
  orgSelectToChuc: any;
  thongbao: string;
  SelectDay: string;
  ngaybaocao: any;
  userId: number;
  loaibaocao: true;
  isDay = false; //xác định trạng thái hiển thị ngày đối với báo cáo định kỳ
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
  drawPoint: any;
  snapPoint: any;

  bind_lat: number; //bind to html nhưng không thành công
  bind_lng: number; //bind to html nhưng không thành công
  items: any[] = [];

  showLoading = false;

  //ckeditor
  public bsModalRef: BsModalRef;
  editor: Editor;
  htmlEditor = "";
  toolbar: Toolbar = [
    ["bold", "italic"],
    ["underline", "strike"],
    ["code", "blockquote"],
    ["ordered_list", "bullet_list"],
    [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
    ["link", "image"],
    ["text_color", "background_color"],
    ["align_left", "align_center", "align_right", "align_justify"],
  ];
  //voice to text
  messages = "";
  placeholder = "";
  listening = false;
  subscription;
  //end voice to text
  Isngaybaocao: boolean = false;
  //loai baocao
  loaiBaoCao: typeof LoaiBaoCaoPAKN = LoaiBaoCaoPAKN;
  arrLoaiBaoCao: any[] = [];
  constructor(
    injector: Injector,
    public _service: PAKNServiceProxy,
    public _serviceMedia: MediaServiceServiceProxy,
    private doituongservice: DoiTuongServiceProxy,
    private tochucservice: OrganizationUnitServiceServiceProxy,
    private route: ActivatedRoute,
    private dvhcservice: DVHCServiceServiceProxy,
    private cQueryableService: CQueryableServiceServiceProxy,
    private sukienservice: SuKienServiceServiceProxy,
    private historyservice: HistoryServiceProxy,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public service: RxSpeechRecognitionService
  ) {
    super(injector);

    this.options = {
      multiple: true,
      tags: true,
    };
  }

  getHistoryByPaknId(paknid) {
    this.historyservice.getAll(paknid).subscribe((rs) => {
      this.historys = rs;
    });
  }

  viewMap() {
    //vector layer tinh,huyen,xa zoomto
    this.vectorZoom = new VectorLayer({
      source: this.vectorZoomSource,
    });
    //eidt point
    this.vectorEditLayer = new VectorLayer({
      source: this.vectorEditSource,
      properties: { title: "Thêm điểm" },
      style: {
        "fill-color": "rgba(138, 4, 4, 0.2)",
        "stroke-color": "#ffcc33",
        "stroke-width": 2,
        "circle-radius": 5,
        "circle-fill-color": "#8a0404",
      },

      visible: true,
      opacity: 1,
    });

    this.map = new Map({
      layers: [
        new LayerGroup({
          properties: { title: "Lớp nền" },
          layers: [
            new TileLayer({
              properties: { title: "BanDoVN", type: "base" },
              source: new XYZ({
                url:
                  "https://basemap.bandovn.vn/server/rest/services/" +
                  "bandovn/MapServer/tile/{z}/{y}/{x}",
              }),
            }),
          ],
        }),
        new LayerGroup({
          properties: { title: "Overlays" },
          layers: [
            new TileLayer({
              properties: { title: "OSM" },
              source: new OSM(),
              visible: true,
              opacity: 0.6,
            }),
            this.vectorEditLayer,
          ],
        }),
      ],
      target: "ol-map",
      view: new View({
        center: [11779995, 2225440], //EPSG:3857 //nếu biết ở latlon thì phải tranform center: ol.proj.transform([-0.92, 52.96], 'EPSG:4326', 'EPSG:3857'),
        zoom: 6,
      }),
    });
    this.layerSwitcher = new LayerSwitcher({
      activationMode: "click",
      startActive: false,
      tipLabel: "Show layer list", // Optional label for button
      collapseTipLabel: "Hide layer list", // Optional label for button
      groupSelectStyle: "children", // Can be 'children' [default], 'group' or 'none'
    });
    this.map.addControl(this.layerSwitcher);

    //add editPoint to map
    this.vectorModify = new Modify({ source: this.vectorEditSource });
    this.vectorModify.on("modifyend", function (e) {
      var features = e.features.getArray();
      if (features.length > 0) {
        let coor = features[0].getGeometry().getCoordinates();
        let coor_4326 = transform([coor[0], coor[1]], "EPSG:3857", "EPSG:4326");
        jQuery("#lat").val(coor_4326[1]); //vĩ độ
        jQuery("#lng").val(coor_4326[0]); //kinh độ

        //mẹo: vì trong phạm vi drawPoint nên this ở lớp ngoài không gọi được. Vì vậy phải nhúng 1 nút và trigger nút đó click
        document.getElementById("btnGetDVHCFromMapPoint").click();
      } else alert("Lỗi khi cập nhật tọa độ điểm cần sửa. Chú ý: nếu tiếp tục lưu báo cáo sẽ bị sai điểm tọa độ");
    });
    this.map.addInteraction(this.vectorModify);

    //add drawPoint to map
    this.drawPoint = new Draw({
      source: this.vectorEditSource,
      type: "Point",
    });
    this.drawPoint.on("drawend", function (e) {
      /**
       * event on drawend
       */
      let coor = e.feature.getGeometry().getCoordinates();
      let coor_4326 = transform([coor[0], coor[1]], "EPSG:3857", "EPSG:4326");
      jQuery("#lat").val(coor_4326[1]); //vĩ độ
      jQuery("#lng").val(coor_4326[0]); //kinh độ

      //mẹo: vì trong phạm vi drawPoint nên this ở lớp ngoài không gọi được. Vì vậy phải nhúng 1 nút và trigger nút đó click
      document.getElementById("btnGetDVHCFromMapPoint").click();
    });
    this.map.addInteraction(this.drawPoint);

    //add snapPoint to map
    this.snapPoint = new Snap({ source: this.vectorEditSource });
    this.map.addInteraction(this.snapPoint);
  }

  getDVHCFromMapPoint() {
    this.showLoading = true;
    let lat = jQuery("#lat").val();
    let lng = jQuery("#lng").val();
    let check_lat = parseFloat(lat.toString()) || 0;
    let check_lng = parseFloat(lng.toString()) || 0;
    if (check_lat != 0 && check_lng != 0) {
      let wkt = "POINT(" + lng + " " + lat + ")";
      this.cQueryableService.whichXaContainPoint(wkt).subscribe(async (rst) => {
        if (rst != null) {
          if (rst.ma_dvhc_t != null && rst.ma_dvhc_t != "") {
            this.orgSelectedTinh = rst.ma_dvhc_t;
            await this.ChangeOrgTinh(rst.ma_dvhc_t);
            this.orgSelectedHuyen = rst.ma_dvhc_h;
            await this.ChangeOrgHuyen(rst.ma_dvhc_h);
            this.orgSelectedXa = rst.ma_dvhc_x;
          }
        }
        this.showLoading = false;
      });
    } else
      alert(
        "Lỗi không có tọa độ trong trường kinh độ, vĩ độ. Phải nhập điểm trên bản đồ!"
      );
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
    if (
      this.orgSelectedXa != undefined &&
      this.orgSelectedXa != "" &&
      this.orgSelectedXa != "0"
    ) {
      //zoom to xa
      // this.cQueryableService.getPAKNGeom(this.id)
      this.cQueryableService
        .getXaGeom(this.orgSelectedXa.toString())
        .subscribe((rst) => {
          let format = new WKT();
          let wkt = rst;
          let feature = format.readFeature(wkt, {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857",
          });
          var vectorZoomSourceFeature = this.vectorZoomSource.getFeatures();
          vectorZoomSourceFeature.forEach((feature) => {
            this.vectorZoomSource.removeFeature(feature);
          });
          this.vectorZoom.getSource().addFeature(feature);
          let ext = feature.getGeometry().getExtent();

          let center = getCenter(ext);
          this.map.setView(
            new View({
              center: [center[0], center[1]],
              zoom: 12,
            })
          );
        });
    } else if (
      this.orgSelectedHuyen != undefined &&
      this.orgSelectedHuyen != "" &&
      this.orgSelectedHuyen != "0"
    ) {
      //zoom to huyen
      this.cQueryableService
        .getHuyenGeom(this.orgSelectedHuyen.toString())
        .subscribe((rst) => {
          let format = new WKT();
          let wkt = rst;
          let feature = format.readFeature(wkt, {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857",
          });
          var vectorZoomSourceFeature = this.vectorZoomSource.getFeatures();
          vectorZoomSourceFeature.forEach((feature) => {
            this.vectorZoomSource.removeFeature(feature);
          });
          this.vectorZoom.getSource().addFeature(feature);
          let ext = feature.getGeometry().getExtent();

          let center = getCenter(ext);
          this.map.setView(
            new View({
              center: [center[0], center[1]],
              zoom: 12,
            })
          );
        });
    } else if (
      this.orgSelectedTinh != undefined &&
      this.orgSelectedTinh != "" &&
      this.orgSelectedTinh != "0"
    ) {
      //zoom to tinh
      this.cQueryableService
        .getTinhGeom(this.orgSelectedTinh.toString())
        .subscribe((rst) => {
          let format = new WKT();
          let wkt = rst;
          let feature = format.readFeature(wkt, {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857",
          });
          var vectorZoomSourceFeature = this.vectorZoomSource.getFeatures();
          vectorZoomSourceFeature.forEach((feature) => {
            this.vectorZoomSource.removeFeature(feature);
          });
          this.vectorZoom.getSource().addFeature(feature);
          let ext = feature.getGeometry().getExtent();

          let center = getCenter(ext);
          this.map.setView(
            new View({
              center: [center[0], center[1]],
              zoom: 12,
            })
          );
        });
    } else {
      abp.notify.error("Phải chọn tỉnh hoặc huyện, xã để xem trên bản đồ");
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
    } else {
      this.map.addInteraction(this.drawPoint);
    }
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.viewMap();
    //this.getDoiTuong();
    this.orgSelected = 0;
    this.getState();
    this.getSuKien();
    this.getAllToChucs();
    this.getLoaiBaoCao();
    this.getAllTinh();

    this.route.queryParams.subscribe((params) => {
      this.id = this.route.snapshot.paramMap.get("id");
      if (this.id > 0) {
        this.getHistoryByPaknId(this.id);
        this._service.getById(this.id).subscribe((rs) => {
          this.UploadImage.onLoadImage(rs.images);
          this.UploadVideo.onLoadVideo(rs.medias);
          this.UploadFile.onLoadFile(rs.files);
          this.orgSelectedLoaiBaoCao = rs.type;
          this.getDoiTuong();
          this.orgSelected = rs.doiTuongId;
          this.getToChucByDoiTuong(rs.doiTuongId);
          this.orgSelectedDonViChuTri = rs.organizationUnitId;
          this.pakn = rs;
          this.htmlEditor = rs.content;
          this.orgSelectedState = rs.state;
          this.changeNoiDung();

          this.orgSuKienSelect = rs.suKienId;
          //this.SelectDay = rs.ngayBaoCao;

          this.appSession.user.id = rs.idUserSend;
          if (
            rs.ma_dvhc_t != null ||
            rs.ma_dvhc_t != undefined ||
            rs.ma_dvhc_t != " "
          ) {
            this.getHuyenByTinh(rs.ma_dvhc_t);
            this.orgSelectedTinh = rs.ma_dvhc_t;
            console.log(rs);
          } else {
            console.log(rs);
            this.orgSelectedTinh = "0";
          }
          if (rs.ma_dvhc_h != null) {
            this.getXaByHuyen(rs.ma_dvhc_h);
            this.orgSelectedHuyen = rs.ma_dvhc_h;
          }

          if (rs.ma_dvhc_x != null) {
            this.orgSelectedXa = rs.ma_dvhc_x;
          }

          jQuery("#lat").val(rs.lat);
          jQuery("#lng").val(rs.lng);

          this.orgSelectToChuc = rs.paknOrg;

          //console.log(rs);
          //vẽ điểm trên bản đồ
          let coor_3857 = transform([rs.lng, rs.lat], "EPSG:4326", "EPSG:3857");
          var feature = new Feature({
            geometry: new Point([coor_3857[0], coor_3857[1]]),
          });
          this.vectorEditSource.addFeature(feature);
        });
      }
    });
  }

  changeNoiDung() {
    if (this.orgSelectedState != 0 && this.orgSelectedState != 4) {
      this.IsHidden = true;
    } else this.IsHidden = false;
  }

  HidenGuiBaoCao(trangthai) {
    if (trangthai > 0) {
      this.IsHiddenGuiBaoCao = true;
    } else this.IsHiddenGuiBaoCao = false;
  }

  ChangeOrg(event) {
    //console.log(this.orgSelectedState);
    this.changeNoiDung();
  }

  ChangeDoiTuong(event) {
    this.getNgayBaoCao(this.orgSelected);
    if (this.orgSelected == 0) {
      this.orgSelectedDonViChuTri = 0;
      this.orgtochuc = null;
    } else {
      this.getToChucByDoiTuong(this.orgSelected);
    }
  }

  getDoiTuong() {
    this.orgSelected = 0;
    this.doituongservice
      .getDoiTuongByUserIdDropdown(
        this.appSession.userId,
        this.orgSelectedLoaiBaoCao
      )
      .subscribe((rs) => {
        this.org = rs;
      });
  }

  getSuKien() {
    this.orgSuKienSelect = 0;
    //Lấy dữ liệu cây tổ chức
    this.sukienservice.getSuKienDropdown().subscribe((rs) => {
      this.orgSuKien = rs;
    });
  }
  getNgayBaoCao(iddoituong) {
    this.SelectDay = "0";
    //Lấy dữ liệu cây tổ chức
    this._service
      .getDayDropdown(
        this.appSession.userId,
        iddoituong,
        this.orgSelectedLoaiBaoCao
      )
      .subscribe((rs) => {
        this.ngaybaocao = rs;
      });
  }
  changeloaibaocao() {
    this.Isngaybaocao = true ? this.orgSelectedLoaiBaoCao > 0 : false;
    this.SelectDay = "0";
    this.orgSelected = 0;
    this.getNgayBaoCao(this.orgSelected);
    this.orgtochuc = null;
    this.getDoiTuong();
  }
  getAllToChucs() {
    setTimeout(() => {
      this.tochucservice.getOrganizationUnitsViewDropdown(0).subscribe((rs) => {
        rs.forEach((el) => {
          this.items.push({ id: el.id.toString(), text: el.displayName });
        });
        this.tochucs = [...this.items];
      });
    }, 1000);
  }

  getToChucByDoiTuong(iddoituong) {
    // this.orgSelectToChuc = 0;
    //Lấy dữ liệu cây tổ chức

    this.tochucservice
      .getOrganizationUnitsByDoiTuongViewDropdown(iddoituong)
      .subscribe((rs) => {
        this.orgtochuc = rs;
        //this.orgSelectedDonViChuTri =0;
      });
  }

  getState() {
    this.orgSelectedState = 0;
    //Lấy dữ liệu cây tổ chức
    this._service.getStateDropdown().subscribe((rs) => {
      this.orgstate = rs;
    });
  }

  getLoaiBaoCao() {
    this.orgSelectedLoaiBaoCao = -1;
    this._service.getLoaiBaoCaoDropdown().subscribe((rs) => {
      this.orgloaibaocao = rs;
    });
    // this.loaiBaoCao.forEach(rs=>{
    //   this.arrLoaiBaoCao.push(rs);
    //})
  }

  saveHistory(idpakn) {
    this.history.nguoiTao = this.appSession.userId;
    this.id = this.route.snapshot.paramMap.get("id");
    this.history.paknId = idpakn;
    this.history.ngayTao = moment(new Date());
    if (this.id > 0) this.history.noiDung = "Sửa thông tin báo cáo";
    else this.history.noiDung = "Tạo mới báo cáo";
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
    var check = this.validateDuLieu();
    if (check == true) {
      this.saving = true;
      this.pakn.doiTuongId = this.orgSelected;
      this.pakn.state = 0; // là m
      this.pakn.paknOrg = this.orgSelectToChuc;
      var lat = parseFloat(jQuery("#lat").val().toString()) || 0;
      var lng = parseFloat(jQuery("#lng").val().toString()) || 0;
      this.pakn.type = this.orgSelectedLoaiBaoCao;
      this.pakn.organizationUnitId = this.orgSelectedDonViChuTri;
      this.pakn.idUserSend = this.appSession.user.id;
      this.pakn.suKienId = this.orgSuKienSelect;
      this.pakn.lat = lat;
      this.pakn.lng = lng;
      this.pakn.content = this.htmlEditor;

      this.pakn.ngayBaoCao = moment(this.SelectDay);
      this.pakn.userId = this.appSession.user.id;

      if (this.orgSelectedTinh == "0") this.pakn.ma_dvhc_t = "0";
      else this.pakn.ma_dvhc_t = this.orgSelectedTinh.toString();

      if (this.orgSelectedHuyen == "0") this.pakn.ma_dvhc_h = "0";
      else this.pakn.ma_dvhc_h = this.orgSelectedHuyen.toString();

      if (this.orgSelectedXa == "0") this.pakn.ma_dvhc_x = "0";
      else this.pakn.ma_dvhc_x = this.orgSelectedXa.toString();

      if (this.SelectDay == "0" && this.orgSelectedLoaiBaoCao != 0) {
        this.isDay = true;
        alert("Phải xác định ngày đối với các báo cáo định kỳ");
        return;
      }
      //trường hợp thêm mới báo cáo
      if (this.id == null) {
        this.isDay = false;
        var ids = this._service.insert(this.pakn).subscribe(
          (rs) => {
            this.saveImage(rs);
            this.saveVideo(rs);
            this.saveFile(rs);
            this.notify.info(this.l("Thêm mới báo cáo thành công!"));
            this.saveHistory(rs);
            this.router.navigate(["/app/pakns"]);
          },
          () => {
            this.saving = false;
          }
        );
      } else {
        //trường hợp sửa báo cáo
        this._service.update(this.pakn).subscribe(
          () => {
            this.notify.info(this.l("Cập nhật báo cáo thành công"));
            this.saveImage(this.id);
            this.saveVideo(this.id);
            this.saveFile(this.id);
            this.saveHistory(this.id);
            this.router.navigate(["/app/pakns"]);
          },
          () => {
            this.saving = false;
          }
        );
      }
    }
  }

  validateDuLieu() {
    // alert(this.pakn.title);
    if (this.pakn.title == undefined) {
      alert("Nhập tiêu đề");
      return false;
    }
    if (this.orgSelected == undefined || this.orgSelected <= 0) {
      alert("Nhập đối tượng");
      return false;
    }
    if (this.orgSelectedDonViChuTri == undefined) {
      alert("Nhập đơn vị chủ trì");
      return false;
    }
    return true;
    //if(this.)
  }

  uploadFinished = (event) => {
    this.responseFileImage.push(event);
    console.log(this.responseFileImage);
  };
  uploadFinishedVideo = (event) => {
    this.responseFileVideo.push(event);
  };
  uploadFinishedFile = (event) => {
    this.responseFile.push(event);
  };

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
        }
      );
    }
  };
  saveVideo = (idpakn) => {
    for (var i = 0; i < this.responseFileVideo.length; i++) {
      this.media.paknId = idpakn;
      this.media.url = this.responseFileVideo[i][i].pathFile;
      this.media.type = Const.type_video; //video
      this._serviceMedia.insert(this.media).subscribe(
        () => {
          this.onSave.emit();
        },
        () => {
          this.saving = false;
        }
      );
    }
  };
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
        }
      );
    }
  };

  // Dungnb code
  getAllTinh() {
    this.orgSelectedTinh = "0";
    this.orgSelectedHuyen = "0";
    this.orgSelectedXa = "0";
    this.dvhcservice.getTinh().subscribe((rs) => {
      this.orgsTinh = rs;
    });
  }
  getHuyenByTinh(ma_tinh) {
    this.orgSelectedHuyen = "0";
    this.dvhcservice.getHuyen(ma_tinh).subscribe((rs) => {
      this.orgsHuyen = rs;
    });
  }
  getXaByHuyen(ma_huyen) {
    this.orgSelectedXa = "0";
    this.dvhcservice.getXa(ma_huyen).subscribe((rs) => {
      this.orgsXa = rs;
    });
  }
  async ChangeOrgTinh(ma_tinh): Promise<boolean> {
    if (this.orgSelectedTinh != "") {
      await this.getHuyenByTinh(ma_tinh);
      return true;
    }
    return false;
  }
  async ChangeOrgHuyen(ma_huyen): Promise<boolean> {
    if (this.orgSelectedHuyen != "") {
      await this.getXaByHuyen(ma_huyen);
      return true;
    }
    return false;
  }
  ChangeLoaiToChuc(idLoaibaocao) {}
  ngOnDestroy(): void {
    this.editor.destroy();
  }
  back() {
    this.router.navigate(["/app/pakns"]);
  }

  //voice to text
  listen(): void {
    this.listening = true;

    const timeout = setInterval(() => {
      location.reload();
    }, 10000);

    this.subscription = this.service
      .listen()
      .pipe(resultList)
      .subscribe((list: SpeechRecognitionResultList) => {
        clearTimeout(timeout);
        this.listening = false;
        this.placeholder = "";

        let message = list.item(0).item(0).transcript;

        if (message === "apagar" || message === "limpar") {
          message = "";
        }

        this.messages = message;
        this.pakn.title = message;
        //console.log('RxComponent:onresult', list);
      });
  }
  //end voice to text
}
