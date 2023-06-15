import {
  PAKNDto,
  Media,
  PAKNServiceProxy,
  DVHCServiceServiceProxy,
  SuKienServiceServiceProxy,
  UserServiceProxy,
  DTOSearchPAKN,
  UserDVHC,
} from "@shared/service-proxies/service-proxies";
import { PagedListingComponentBase } from "@shared/paged-listing-component-base";
import {
  CQueryableServiceServiceProxy,
  DoiTuongServiceProxy,
  OrganizationUnitServiceServiceProxy,
  SearchDto,
  SearchPAKNServiceServiceProxy,
} from "./../../shared/service-proxies/service-proxies";
import { AfterViewInit, Component, Injector, OnInit } from "@angular/core";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import LayerGroup from "ol/layer/Group";
import XYZ from "ol/source/XYZ";
import TileWMS from "ol/source/TileWMS";
import LayerSwitcher from "ol-layerswitcher";
import { title } from "process";
import { Feature, Overlay } from "ol";
import { Coordinate } from "ol/coordinate";
import { Projection, toLonLat, transform } from "ol/proj";
import { AppComponentBase } from "@shared/app-component-base";
import { isBuffer, result, toNumber } from "lodash-es";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import WKT from "ol/format/WKT";
import { getCenter } from "ol/extent";
import { Options } from "select2";
import { Select2OptionData } from "ng-select2";
import { environment } from "environments/environment";
import { Const, ENhomNguoiDung } from "@shared/constant/constant";
import { Point } from "ol/geom";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { IMyDate, IMyDpOptions } from "mydatepicker";

@Component({
  selector: "app-map-openlayers",
  templateUrl: "./map-openlayers.component.html",
  styleUrls: ["./map-openlayers.component.css"],
})
export class MapOpenlayersComponent extends AppComponentBase implements OnInit {
  map: Map;
  layerSwitcher: LayerSwitcher;
  add_point_x: string = "";
  add_point_y: string = "";
  isSeachCollapsed: boolean = false;
  sfilter: string; //https://docs.geoserver.org/stable/en/user/tutorials/cql/cql_tutorial.html

  view_map: View;
  overlay: Overlay;
  vectorZoomSource = new VectorSource();
  vectorZoom = new VectorLayer();
  vectorBCSource = new VectorSource();
  vectorBCLayer = new VectorLayer();

  //pakns:SearchDto[]=[];
  pakns: DTOSearchPAKN[] = [];
  //mapping search element
  keyword = "";
  ddlToChuc: any;
  ddlToChucSelected: number;
  ddlDoiTuong: any;
  ddlDoiTuongSelected: number;
  ddlState: any;
  ddlStateSelected: number;
  //tinh huyen xa
  ddlTinh: any;
  ddlTinhSelected: string;
  ddlHuyen: any;
  ddlHuyenSelected: string;
  ddlXa: any;
  ddlXaSelected: string;
  //loại sự kiện
  ddlLoaiSuKien: any;
  ddlLoaiSuKienSelected: number;
  //từ ngày, tới ngày
  from_date: any;
  to_date: any;
  //end mapping search element

  totalItems: number;
  //popup bind
  popup_title: string;
  popup_tenToChuc: string;
  popup_tenDoiTuong: string;
  popup_NoiDung: string;

  imgs: Media[] = [];
  videos: Media[] = [];
  files: Media[] = [];
  url: any;

  style_fill0 = new Fill({
    color: "rgba(252, 186, 3,0.4)", //vàng
  });
  style_fill1 = new Fill({
    color: "rgba(9, 230, 230,0.4)", //cyan
  });
  style_fill2 = new Fill({
    color: "rgba(196, 138, 12,0.4)", //cyan
  });
  style_fill3 = new Fill({
    color: "rgba(204, 65, 14, 0.2)", //red yeallow
  });
  style_fill4 = new Fill({
    color: "rgba(173, 31, 224, 0.2)", //crimson
  });
  style_fill5 = new Fill({
    color: "rgba(6, 109, 189, 0.2)", //blue
  });

  style_stroke1 = new Stroke({
    color: "#3399CC",
    width: 2,
  });

  style0 = new Style({
    image: new Circle({
      fill: this.style_fill0,
      stroke: this.style_stroke1,
      radius: 5,
    }),
    fill: this.style_fill0,
    stroke: this.style_stroke1,
  });

  style1 = new Style({
    image: new Circle({
      fill: this.style_fill1,
      stroke: this.style_stroke1,
      radius: 5,
    }),
    fill: this.style_fill1,
    stroke: this.style_stroke1,
  });

  style2 = new Style({
    image: new Circle({
      fill: this.style_fill2,
      stroke: this.style_stroke1,
      radius: 5,
    }),
    fill: this.style_fill2,
    stroke: this.style_stroke1,
  });

  style3 = new Style({
    image: new Circle({
      fill: this.style_fill3,
      stroke: this.style_stroke1,
      radius: 5,
    }),
    fill: this.style_fill3,
    stroke: this.style_stroke1,
  });

  style4 = new Style({
    image: new Circle({
      fill: this.style_fill4,
      stroke: this.style_stroke1,
      radius: 5,
    }),
    fill: this.style_fill4,
    stroke: this.style_stroke1,
  });

  style5 = new Style({
    image: new Circle({
      fill: this.style_fill5,
      stroke: this.style_stroke1,
      radius: 5,
    }),
    fill: this.style_fill5,
    stroke: this.style_stroke1,
  });

  //check quyền người dùng
  checkNhomNguoiDung: number;
  xemBaoCaoDVHC: UserDVHC[] = [];
  //end check quyền người dùng
  orgSelected: number;
  orgDoiTuong: any;

  saving = false;
  startDate: string;
  endDate: string;
  public selDate: IMyDate;
  public endselDate: IMyDate;
  myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: "dd/mm/yyyy",
    showTodayBtn: true,
    todayBtnTxt: "Today",
    disableUntil: {
      year: 1111,
      month: 1,
      day: 1,
    },
  };
  constructor(
    injector: Injector,
    private cQueryableService: CQueryableServiceServiceProxy,
    public _searchService: SearchPAKNServiceServiceProxy,
    private orgService: OrganizationUnitServiceServiceProxy,
    public _doituongService: DoiTuongServiceProxy,
    public _paknService: PAKNServiceProxy,
    private dvhcservice: DVHCServiceServiceProxy,
    private sukienservice: SuKienServiceServiceProxy,
    private _userService: UserServiceProxy
  ) {
    super(injector);
    this.url = environment.baseUrlMedia;
  }

  async ngOnInit(): Promise<void> {
    //check nhóm người dùng
    var rst = await this._userService
      .getRolesByUserID(this.appSession.user.id)
      .toPromise();
    if (rst.includes(ENhomNguoiDung.XemBaoCao)) {
      this.checkNhomNguoiDung = ENhomNguoiDung.XemBaoCao;
    } else if (rst.includes(ENhomNguoiDung.DuyetBaoCao)) {
      this.checkNhomNguoiDung = ENhomNguoiDung.DuyetBaoCao;
    } else if (rst.includes(ENhomNguoiDung.BaoCao)) {
      this.checkNhomNguoiDung = ENhomNguoiDung.BaoCao;
    } else
      abp.notify.error(
        "Chưa phân quyền nhóm người dùng",
        "",
        "Liên hệ tới ban quản trị để được phân quyền"
      );

    if (this.checkNhomNguoiDung == ENhomNguoiDung.XemBaoCao) {
      this.xemBaoCaoDVHC = await this.dvhcservice
        .getDVHCPhanChoNguoiDung(this.appSession.user.id)
        .toPromise();
      if (this.xemBaoCaoDVHC.length == 0)
        abp.notify.error(
          "Chưa phân quyền DVHC",
          "Chưa cấu hình đơn vị hành chính cho người dùng xem báo cáo",
          "Liên hệ tới ban quản trị để được phân quyền"
        );
    }

    //popup
    let container = document.getElementById("popup");
    this.overlay = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 150,
        },
      },
    });
    //end popup

    this.view_map = new View({
      center: [11779995, 2225440],
      zoom: 6,
    });

    this.vectorZoom = new VectorLayer({
      source: this.vectorZoomSource,
    });

    this.vectorBCLayer = new VectorLayer({
      source: this.vectorBCSource,
      properties: { title: "Điểm báo cáo" },
      style: {
        "fill-color": "rgba(138, 4, 4, 0.2)",
        "stroke-color": "#ffcc33",
        "stroke-width": 2,
        "circle-radius": 5,
        "circle-fill-color": "#8a0404",
      },
      // style: function (feature, resolution) {
      //   const state = toNumber(feature.get('state')) ;
      //   return state == 1 ? style1 : style2;
      // },
      visible: true,
      opacity: 1,
    });

    this.map = new Map({
      overlays: [this.overlay],
      view: this.view_map,
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
          properties: { title: "Chồng xếp" },
          layers: [
            new TileLayer({
              properties: { title: "OSM" },
              source: new OSM(),
              visible: true,
              opacity: 0.6,
            }),
            this.vectorBCLayer,
          ],
        }),
      ],
      target: "ol-map",
    });

    this.layerSwitcher = new LayerSwitcher({
      activationMode: "click",
      startActive: false,
      tipLabel: "Show layer list",
      collapseTipLabel: "Hide layer list",
      groupSelectStyle: "children",
    });
    this.map.addControl(this.layerSwitcher);

    //lấy danh sách tỉnh
    if (this.checkNhomNguoiDung == ENhomNguoiDung.XemBaoCao) {
      if (this.xemBaoCaoDVHC != undefined && this.xemBaoCaoDVHC.length > 0) {
        let atinh = new Array();
        //lấy tỉnh, xem có được phân quyền trên nhiều tỉnh hay không?
        this.xemBaoCaoDVHC.forEach((dvhc) => {
          if (atinh.indexOf(dvhc.dvhC_MaTinh) < 0) atinh.push(dvhc.dvhC_MaTinh);
        });
        //lấy tỉnh được phân quyền
        this.ddlTinhSelected = "0";
        this.ddlHuyenSelected = "0";
        this.ddlXaSelected = "0";

        this.dvhcservice.getTinhIn(atinh).subscribe((rs) => {
          this.ddlTinh = rs;
          //zoom tới bản đồ trong trường hợp người dùng chỉ được phân quyền trên 1 tỉnh
          if (rs.length == 1) {
            if (rs[0].wbk_geometry != null && rs[0].wbk_geometry != "") {
              let format = new WKT();
              let wkt = rs[0].wbk_geometry;
              let feature = format.readFeature(wkt, {
                dataProjection: "EPSG:4326",
                featureProjection: "EPSG:3857",
              });
              var vectorZoomSourceFeature = this.vectorZoomSource.getFeatures();
              vectorZoomSourceFeature.forEach((feature) => {
                this.vectorZoomSource.removeFeature(feature);
              });
              this.vectorZoom.getSource().addFeature(feature);

              this.map.getView().fit(feature.getGeometry().getExtent());
            }
          }
        });
      } else
      {
        abp.notify.error(
          "Chưa phân quyền đơn vị hành chính cho người dùng xem báo cáo"
        );
      }

    } else
    {this.getAllTinh()};

    //lấy danh sách loại sự kiện
    this.getLoaiSuKiens();

    //Dungnb code tiếp

    this.getState();
    this.getToChuc();
    this.getDoiTuong(0);

    //this.getPAKN();

    //DuongDT sửa bổ sung
    this.orgSelected = 0;

    //ngày bắt đầu
    let d: Date = new Date();
    this.selDate = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };
    this.startDate =
      this.selDate.day + "/" + this.selDate.month + "/" + this.selDate.year;
    //ngày hết hạn
    this.endselDate = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };
    this.endDate =
      this.endselDate.day +
      "/" +
      this.endselDate.month +
      "/" +
      this.endselDate.year;
  } //end init

  /**
   * search báo cáo
   */
  getPAKN() {
    //thêm yếu tố quyền:
    let xemBC_DVHC = new Array();
    this.xemBaoCaoDVHC.forEach((e) => {
      xemBC_DVHC.push(
        new Object({ DVHC_MaTinh: e.dvhC_MaTinh, DVHC_MaHuyen: e.dvhC_MaHuyen })
      );
    });
    //từ ngày, tới ngày
    let ngaybatdau :string;
    let ngayketthuc :string;
    if(this.startDate != "0/0/0")
    {
      let d= this.startDate.split('/');
      ngaybatdau =d[1]+"/"+d[0]+"/"+d[2];
    }
    if(this.endDate != "0/0/0")
    {
      let d= this.endDate.split('/');
      ngayketthuc =d[1]+"/"+d[0]+"/"+d[2];
    }
    this.cQueryableService;
    this.cQueryableService
      .searchPAKN(
        this.keyword == undefined ? "" : this.keyword,
        this.ddlTinhSelected,
        this.ddlHuyenSelected,
        this.ddlXaSelected,
        this.startDate == undefined ? "" :   ngaybatdau,
        this.endDate == undefined ? "" :   ngayketthuc,
        this.ddlToChucSelected,
        this.ddlDoiTuongSelected,
        this.ddlStateSelected,
        this.ddlLoaiSuKienSelected,
        this.checkNhomNguoiDung,
        xemBC_DVHC
      )
      .subscribe((rs) => {
        this.pakns = rs;
        //console.log(rs);
        if (rs.length == 0) {
          abp.notify.error("Chưa có dữ liệu");
          this.pakns = rs;
        }
        //vẽ điểm trên bản đồ
        rs.forEach((r) => {
          let format = new WKT();
          if (r.geom != null && r.geom != "") {
            let feature = format.readFeature(r.geom, {
              dataProjection: "EPSG:4326",
              featureProjection: "EPSG:3857",
            });
            feature.setProperties({ id_pakn: r.id });

            if (r.state == 0) feature.setStyle(this.style0);
            else if (r.state == 1) feature.setStyle(this.style1);
            else if (r.state == 2) feature.setStyle(this.style2);
            else if (r.state == 3) feature.setStyle(this.style3);
            else if (r.state == 4) feature.setStyle(this.style4);
            else if (r.state == 5) feature.setStyle(this.style5);
            this.vectorBCSource.addFeature(feature);
          }
        });
      });
  }
  huyPAKN() {
    //this.pakns=[];
    let d: Date = new Date();
    this.keyword = "";
    this.ddlToChucSelected = 0;
    this.ddlStateSelected = -1;
    this.ddlDoiTuongSelected = 0;
    this.ddlLoaiSuKienSelected = 0;
    this.ddlXaSelected = "0";
    this.ddlHuyenSelected = "0";
    this.ddlTinhSelected = "0";
    this.selDate = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };
    this.endselDate = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };
    this.startDate =
      this.selDate.day + "/" + this.selDate.month + "/" + this.selDate.year;
    this.endDate =
      this.endselDate.day +
      "/" +
      this.endselDate.month +
      "/" +
      this.endselDate.year;
  }

  closePopup(event: any) {
    this.overlay.setPosition(undefined);
    let closer = document.getElementById("popup-closer");
    closer.blur();
    return false;
  }

  mousePosition = {
    x: 0,
    y: 0,
  };

  onMouseDown($event: MouseEvent) {
    this.mousePosition.x = $event.screenX;
    this.mousePosition.y = $event.screenY;
  }

  onClick($event: PointerEvent) {
    if (
      this.mousePosition.x === $event.screenX &&
      this.mousePosition.y === $event.screenY
    ) {
      var coordinate = this.map.getEventCoordinate($event);
      var pixel = this.map.getPixelFromCoordinate(coordinate);
      let id_pakn = 0;
      this.map.forEachFeatureAtPixel(pixel, function (feature) {
        let pros = feature.getProperties();
        if (pros != null) {
          id_pakn = pros.id_pakn;
        } else this.closePopup(null);
      });
      if (id_pakn != 0) {
        //gọi ajax
        this.cQueryableService.getPAKNByID_PAKN(id_pakn).subscribe((rst) => {
          this.popup_title = rst.title;
          this.popup_tenDoiTuong = rst.tenDoiTuong;
          this.popup_tenToChuc = rst.tenToChuc;
          this.popup_NoiDung = rst.content;
          this.imgs = rst.images;
          this.videos = rst.medias;
          this.files = rst.files;
        });
        this.overlay.setPosition(coordinate);
      } else this.closePopup(null);
    }
  }
  /**
   *
   * @param id : id_pakn
   */
  zoomToMap(id: number) {
    let lat = 0,
      lng = 0;
    this._paknService.getById(id).subscribe((result) => {
      lat = result.lat;
      lng = result.lng;
      if (lat != null && lat != 0 && lng != 0 && lng != null) {
        this.cQueryableService.getPAKNGeom(id).subscribe((rst) => {
          if (rst != null && rst != "") {
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
            //zoom to point
            let ext = feature.getGeometry().getExtent();
            let center = getCenter(ext);
            this.map.setView(
              new View({
                center: [center[0], center[1]],
                zoom: 12,
              })
            );

            //this.map.getView().fit(feature.getGeometry().getExtent());
          } else
            abp.message.info(
              "Điểm đã chọn không có tọa độ",
              "Không tìm thấy tọa độ"
            );
        });
      } else {
        abp.message.info(
          "Điểm đã chọn không có tọa độ",
          "Không tìm thấy tọa độ"
        );
      }
    });
  }

  getState() {
    this.ddlStateSelected = -1;
    this._searchService.getStateDropdown().subscribe((rs) => {
      this.ddlState = rs;
    });
  }

  public createImgPath = (serverPath: string) => {
    return this.url + serverPath;
  };
  public SplitFile(pathFile: string): string {
    let str = pathFile.split("\\")[2];
    return str;
  }

  //tinh huyen xa
  getAllTinh() {
    this.ddlTinhSelected = "0";
    this.ddlHuyenSelected = "0";
    this.ddlXaSelected = "0";
    this.dvhcservice.getTinh().subscribe((rs) => {
      this.ddlTinh = rs;
    });
  }
  getHuyenByTinh(ma_tinh) {
    this.ddlHuyenSelected = "0";
    if (this.checkNhomNguoiDung == ENhomNguoiDung.XemBaoCao) {
      if (this.xemBaoCaoDVHC != undefined && this.xemBaoCaoDVHC.length > 0) {
        let ahuyen = new Array();
        this.xemBaoCaoDVHC.forEach((dvhc) => {
          if (ahuyen.indexOf(dvhc.dvhC_MaHuyen) < 0)
            ahuyen.push(dvhc.dvhC_MaHuyen);
        });

        if (ahuyen.indexOf("0") > 0) {
          //nếu có phân quyền tất cả huyện thì lấy tất cả huyện
          this.dvhcservice.getHuyen(ma_tinh).subscribe((rs) => {
            this.ddlHuyen = rs;
          });
        } else if (ahuyen.length > 0) {
          this.dvhcservice.getHuyenIn(ma_tinh, ahuyen).subscribe((rs) => {
            this.ddlHuyen = rs;
          });
        } else {
          abp.notify.error(
            "Chửa phân quyền đơn vị hành chính cấp huyện cho người dùng xem báo cáo"
          );
        }
      } else
        abp.notify.error(
          "Chưa phân quyền đơn vị hành chính cho người dùng xem báo cáo"
        );
    } else {
      this.dvhcservice.getHuyen(ma_tinh).subscribe((rs) => {
        this.ddlHuyen = rs;
      });
    }
  }
  getXaByHuyen(ma_huyen) {
    this.ddlXaSelected = "0";
    this.dvhcservice.getXa(ma_huyen).subscribe((rs) => {
      this.ddlXa = rs;
    });
  }
  ChangeOrgTinh(ma_tinh): boolean {
    if (this.ddlTinhSelected != "") {
      this.getHuyenByTinh(ma_tinh);
      return true;
    }
    return false;
  }
  ChangeOrgHuyen(ma_huyen): boolean {
    if (this.ddlHuyenSelected != "") {
      this.getXaByHuyen(ma_huyen);
      return true;
    }
    return false;
  }
  //loại sự kiện
  getLoaiSuKiens() {
    this.ddlLoaiSuKienSelected = 0;
    this.sukienservice.getSuKienDropdown().subscribe((rs) => {
      this.ddlLoaiSuKien = rs;
    });
  }
  /**
   * 1. Lấy tổ chức theo các đối tượng đã phân công cho người dùng theo từng loại báo cáo, duyệt, xem
   */
  getToChuc() {
    this.ddlDoiTuongSelected = 0;
    this.ddlToChucSelected = 0;
    this.orgDoiTuong = 0;
    if (this.checkNhomNguoiDung == ENhomNguoiDung.DuyetBaoCao) {
      this.cQueryableService
        .getToChucDuyet(this.appSession.user.id)
        .subscribe((rst) => {
          this.ddlToChuc = rst;
        });
    } else if (this.checkNhomNguoiDung == ENhomNguoiDung.BaoCao) {
      this.cQueryableService
        .getToChucBaoCao(this.appSession.user.id)
        .subscribe((rst) => {
          this.ddlToChuc = rst;
        });
    } else if (this.checkNhomNguoiDung == ENhomNguoiDung.XemBaoCao) {
      this.cQueryableService
        .getToChucXem(this.appSession.user.id)
        .subscribe((rst) => {
          this.ddlToChuc = rst;
        });
    }
  }

  /**
   * id_tochuc=0 => lấy tất cả đối tượng đã phân công cho người dùng theo từng loại báo cáo, duyệt, xem
   * id_tochuc!=0 => lấy đối tượng thuộc tổ chức
   * @param id_tochuc
   */
  getDoiTuong(id_tochuc) {
    // if (id_tochuc != 0) {
    //   this.orgSelected = 0;
    //   this._doituongService.getDoiTuongByToChuc(id_tochuc).subscribe((rs) => {
    //     this.ddlDoiTuong = rs;
    //   });
    // } else {
      if (this.checkNhomNguoiDung == ENhomNguoiDung.DuyetBaoCao) {
        this.cQueryableService
          .getDoiTuongDuyet(this.appSession.user.id, id_tochuc)
          .subscribe((rst) => {
            this.ddlDoiTuong = rst;
          });
      } else if (this.checkNhomNguoiDung == ENhomNguoiDung.BaoCao) {
        this.cQueryableService
          .getDoiTuongBaoCao(this.appSession.user.id, id_tochuc)
          .subscribe((rst) => {
            this.ddlDoiTuong = rst;
          });
      } else if (this.checkNhomNguoiDung == ENhomNguoiDung.XemBaoCao) {
        this.cQueryableService
          .getDoiTuongXem(this.appSession.user.id, id_tochuc)
          .subscribe((rst) => {
            this.ddlDoiTuong = rst;
          });
      }
    // }
  }

  ChangeOrgToChuc(id_tochuc) {
    if (id_tochuc != 0) {
      this.getDoiTuong(id_tochuc);
      this.orgDoiTuong = 0;
      this.ddlDoiTuongSelected = 0;
    } else {
    }
  }

  //onchang ngày bắt đầy
  onDateChanged($event) {
    let d = $event.date;
    //console.log($event.date.day);
    this.startDate = d.day + "/" + d.month + "/" + d.year;
    //console.log("datechange:" + this.startDate);
  }
  onChange($event) {
    //console.log("vào onchange.");
    this.startDate = $event.target.value;
    //console.log(this.startDate);
  }

  //onchang ngày hết hạn
  onDateChangedEndDay($event) {
    let d = $event.date;
    //console.log($event.date.day);
    this.endDate = d.day + "/" + d.month + "/" + d.year;
    //console.log("datechange:" + this.startDate);
  }
  onChangeEndDay($event) {
    //console.log("vào onchange.");
    this.endDate = $event.target.value;
    //console.log(this.startDate);
  }
}
