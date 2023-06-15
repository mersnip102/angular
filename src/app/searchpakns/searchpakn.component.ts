import { Component, Injector } from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  SuKienServiceServiceProxy,
  CQueryableServiceServiceProxy,
  UserServiceProxy,
  DTOSearchPAKN,
  UserDVHC,
  DVHCServiceServiceProxy,
  DoiTuongServiceProxy,
  OrganizationUnitServiceServiceProxy,
  PAKNDto,
  PAKNServiceProxy,
} from "@shared/service-proxies/service-proxies";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "@shared/paged-listing-component-base";
import {
  SearchPAKNServiceServiceProxy,
  SearchDto,
  SearchDtoPagedResultDto,
} from "@shared/service-proxies/service-proxies";
import WKT from "ol/format/WKT";
import { Select2OptionData } from "ng-select2";
import { Options } from "select2";
import { request } from "http";
import VectorSource from "ol/source/Vector";
import { Const, ENhomNguoiDung } from "@shared/constant/constant";
import {
  resultList,
  RxSpeechRecognitionService,
} from "@kamiazya/ngx-speech-recognition";
import { IMyDate, IMyDpOptions } from "mydatepicker";
import * as moment from "moment";

@Component({
  templateUrl: "./searchpakn.component.html",
  styleUrls: ["./searchpakn.component.css"],
  animations: [appModuleAnimation()],
})
export class SearchpaknComponent extends PagedListingComponentBase<SearchDto> {
  protected delete(entity: SearchDto): void {
    throw new Error("Method not implemented.");
  }
  org: any;
  IsHidden: any;
  datas: Array<Select2OptionData>;
  orgDoiTuong: any;
  orgstate: any;
  orgtochuc: any;
  tochucid: number;
  pakn: PAKNDto = new PAKNDto();
  orgSelected: number;
  public doituongs: Array<Select2OptionData>;
  orgSelectedState: number;
  orgSelectedTochuc: any;
  public options: Options;
  xemBC_DVHC = new Array();
  searchs: SearchDto[] = [];
  vectorBCSource = new VectorSource();
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
  //mapping search element

  ddlToChuc: any;
  ddlToChucSelected: number;
  ddlDoiTuong: any;
  ddlDoiTuongSelected: number;
  ddlState: any;
  ddlStateSelected: number;
  pakns: DTOSearchPAKN[] = [];
  //từ ngày, tới ngày
  from_date: any;
  to_date: any;
  keyword = "";
  doiTuonng = 0;
  trangThai = -1;
  tochuc = 0;
  advancedFiltersVisible = false;
  isActive: boolean | null;
  request: any;
  //check quyền người dùng
  checkNhomNguoiDung: number;
  xemBaoCaoDVHC: UserDVHC[] = [];
  //voice to text
  messages = "";
  placeholder = "";
  listening = false;
  subscription;
  //end voice to text
  //cấu hình là ngày
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
    public _searchService: SearchPAKNServiceServiceProxy,
    //public _service: SearchPAKNServiceServiceProxy,
    private doituongservice: DoiTuongServiceProxy,
    private tochucservice: OrganizationUnitServiceServiceProxy,
    private dvhcservice: DVHCServiceServiceProxy,
    private _userService: UserServiceProxy,
    private cQueryableService: CQueryableServiceServiceProxy,
    private sukienservice: SuKienServiceServiceProxy,
    public service: RxSpeechRecognitionService
  ) {
    super(injector);
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
    }

    if (this.checkNhomNguoiDung == ENhomNguoiDung.XemBaoCao) {
      this.xemBaoCaoDVHC = await this.dvhcservice
        .getDVHCPhanChoNguoiDung(this.appSession.user.id)
        .toPromise();
    }
    this.getState();
    this.orgSelected = 0;
    this.getToChuc();
    this.getDataPage(1);
    this.getLoaiSuKiens();
    //this.getPAKN();
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
        });
      } else
        abp.notify.error(
          "Chưa phân quyền đơn vị hành chính cho người dùng xem báo cáo"
        );
    } else this.getAllTinh();
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
      this.ddlXaSelected = "0";
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
  items: any[] = [];

  changeNoiDung() {
    if (this.orgSelectedState != -1 && this.orgSelectedState != 4) {
      this.IsHidden = true;
    } else this.IsHidden = false;
  }
  ChangeOrgToChuc(id_tochuc) {
    this.orgSelected = 0;
    this.getDoiTuong(id_tochuc);
    this.orgDoiTuong = 0;
  }
  ChangeOrg(event) {
    this.changeNoiDung();
  }
  getDoiTuong(id_tochuc) {
    // if (id_tochuc != 0) {
    //   this.orgSelected = 0;
    //   this.doituongservice.getDoiTuongByToChuc(id_tochuc).subscribe((rs) => {
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
  //loại sự kiện
  getLoaiSuKiens() {
    this.ddlLoaiSuKienSelected = 0;
    this.sukienservice.getSuKienDropdown().subscribe((rs) => {
      this.ddlLoaiSuKien = rs;
    });
  }

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

  getState() {
    this.ddlStateSelected = -1;
    this._searchService.getStateDropdown().subscribe((rs) => {
      this.ddlState = rs;
    });
  }
  protected list(
    request: any,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    (request.keyword = this.keyword),
      (request.doiTuonng = this.orgSelected),
      (request.toChuc = this.orgSelectedTochuc),
      (request.trangThai = this.orgSelectedState),
      this.xemBaoCaoDVHC.forEach((e) => {
        this.xemBC_DVHC.push(
          new Object({
            DVHC_MaTinh: e.dvhC_MaTinh,
            DVHC_MaHuyen: e.dvhC_MaHuyen,
          })
        );
      });
    this.cQueryableService
      .searchPAKN(
        this.keyword == undefined ? "" : this.keyword,
        this.ddlTinhSelected,
        this.ddlHuyenSelected,
        this.ddlXaSelected,
        this.from_date == undefined ? "" : this.from_date,
        this.to_date == undefined ? "" : this.to_date,
        this.ddlToChucSelected,
        this.ddlDoiTuongSelected,
        this.ddlStateSelected,
        this.ddlLoaiSuKienSelected,
        this.checkNhomNguoiDung,
        this.xemBC_DVHC
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result) => {
        if (result != null || result != undefined) {
          this.pakns = result;
        } else {
          this.pakns = result;
          abp.notify.error("Chưa có dữ liệu");
        }
        //console.log(this.pakns);
        //this.showPaging(result, pageNumber);
      });
  }
  getPAKN() {
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
    this.cQueryableService
      .searchPAKN(
        this.keyword == undefined ? "" : this.keyword,
        this.ddlTinhSelected,
        this.ddlHuyenSelected,
        this.ddlXaSelected,
        this.startDate == undefined ? "" : ngaybatdau,
        this.endDate == undefined ? "" : ngayketthuc,
        this.ddlToChucSelected,
        this.ddlDoiTuongSelected,
        this.ddlStateSelected,
        this.ddlLoaiSuKienSelected,
        this.checkNhomNguoiDung,
        xemBC_DVHC
      )
      .subscribe((rs) => {
        if (rs.length > 0) {
          this.pakns = rs;
        } else {
          abp.notify.error("Chưa có dữ liệu");
          this.pakns = rs;
        }
      });
  }
  huyPAKN() {
    this.ddlStateSelected = 0;
    this.ddlDoiTuongSelected = 0;
    this.ddlLoaiSuKienSelected = 0;
    this.ddlToChucSelected = 0;
    this.ddlTinhSelected = "0";
    this.ddlXaSelected = "0";
    this.ddlHuyenSelected = "0";
    this.to_date = "";
    this.from_date = "";
    this.keyword = "";
  }

  clearFilters(): void {
    this.keyword = "";
    this.isActive = undefined;
    // this.trangThai = 1;
    // this.doiTuonng =0;
    // this.tochuc =0;
    this.getDataPage(1);
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

        this.keyword = message;

        //console.log('RxComponent:onresult', list);
      });
  }
  //end voice to text

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
