import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import {
  DoiTuongServiceProxy,
  OrganizationUnitServiceServiceProxy,
  PAKNDto,
  HistorysDto,
  PAKNServiceProxy,
  DVHCServiceServiceProxy,
  SuKienServiceServiceProxy,
  HistoryServiceProxy,
  HistoryAddNguoiTaoDto,
} from "@shared/service-proxies/service-proxies";
import { forEach } from "lodash-es";
import { LongDateFormatKey } from "moment";

import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Select2OptionData } from "ng-select2";
import { Options } from "select2";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";

@Component({
  selector: "app-xuly-baocao",
  templateUrl: "./xuly-baocao.component.html",
  styleUrls: ["./xuly-baocao.component.css"],
})
export class XulyBaocaoComponent extends AppComponentBase implements OnInit {
  saving = false;
  org: any;
  IsHidden: any;
  orgstate: any;
  orgtochuc: any;
  tochucid: number;
  pakn: PAKNDto = new PAKNDto();
  orgSelected: number;
  public doituongs: Array<Select2OptionData>;
  orgSelectedLoaiBaoCao: number;
  orgloaibaocao: any;
  orgSelectedState: any;
  orgSelectToChuc: any;
  orgsTinh: any;
  orgsHuyen: any;
  orgsXa: any;
  orgSuKienSelect: number;
  orgSuKien: any;
  history: HistorysDto = new HistorysDto();
  orgSelectedTinh: string;
  orgSelectedHuyen: string;
  orgSelectedXa: string;
  guibaocao: boolean;
  duyetbaocao: boolean;
  public options: Options;
  public tochucs: Array<Select2OptionData>;
  historys: HistoryAddNguoiTaoDto[] = [];
  orgSelectedDonViChuTri: number;
  @Output() onSave = new EventEmitter<any>();
  id: any;
  //ckeditor
  editor = ClassicEditor;
  data: any = `<p>Hello, world!</p>`;
  config = {
    toolbar: [
      "undo",
      "redo",
      "|",
      "heading",
      "fontFamily",
      "fontSize",
      "|",
      "bold",
      "italic",
      "underline",
      "fontColor",
      "fontBackgroundColor",
      "highlight",
      "|",
      "link",
      "CKFinder",
      "imageUpload",
      "mediaEmbed",
      "|",
      "alignment",
      "bulletedList",
      "numberedList",
      "|",
      "indent",
      "outdent",
      "|",
      "insertTable",
      "blockQuote",
      "specialCharacters",
    ],
    language: "id",
    image: {
      toolbar: ["imageTextAlternative", "imageStyle:full", "imageStyle:side"],
    },
  };
  constructor(
    injector: Injector,
    public _service: PAKNServiceProxy,
    private doituongservice: DoiTuongServiceProxy,
    private tochucservice: OrganizationUnitServiceServiceProxy,
    private dvhcservice: DVHCServiceServiceProxy,
    private route: ActivatedRoute,
    private historyservice: HistoryServiceProxy,
    private sukienservice: SuKienServiceServiceProxy,
    private cdref: ChangeDetectorRef
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
      //console.log(rs);
    });
  }

  getRoleGuiBaoCao() {
    this._service.getRoleGuiBaoCao(this.appSession.userId).subscribe((rs) => {
      this.guibaocao = rs;
      //console.log(this.guibaocao);
    });
  }

  getRoleDuyetBaoCao() {
    this._service.getRoleDuyetBaoCao(this.appSession.userId).subscribe((rs) => {
      this.duyetbaocao = rs;
    });
  }

  ngOnInit(): void {
    this.orgSelectedState = 0;
    this.getDoiTuong();
    this.getState();
    this.getAllToChucs();
    this.getAllDoiTuong();
    this.getLoaiBaoCao();
    this.getRoleGuiBaoCao();
    this.getRoleDuyetBaoCao();
    this.getSuKien();
    this.getAllTinh();
    this.route.queryParams.subscribe((params) => {
      this.id = this.route.snapshot.paramMap.get("id");
      this.getHistoryByPaknId(this.id);
      if (this.id > 0) {
        this._service.getById(this.id).subscribe((rs) => {
          if (rs != null || rs != undefined) {
            this.orgSelected = rs.doiTuongId;
            this.orgSelectedLoaiBaoCao = rs.type;
            this.pakn = rs;

            // if (rs.stateName != null || rs.stateName != undefined) {
            //   this.changeNoiDung();
            //   this.orgSelectedState = rs.stateName.toString();
            //   console.log(this.orgSelectedState);
            // }
            this.orgSuKienSelect = rs.suKienId;
            this.orgSelectToChuc = rs.paknOrg;
            this.getToChucByDoiTuong(rs.doiTuongId);

            if (rs.ma_dvhc_t != undefined) {
              this.getHuyenByTinh(rs.ma_dvhc_t);
              this.orgSelectedTinh = rs.ma_dvhc_t;
            }

            if (rs.ma_dvhc_h != undefined) {
              this.getXaByHuyen(rs.ma_dvhc_h);
              this.orgSelectedHuyen = rs.ma_dvhc_h;
            }

            if (rs.ma_dvhc_x != undefined) {
              this.orgSelectedXa = rs.ma_dvhc_x;
            }
          }
        });
      }
    });
  }

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
  getLoaiBaoCao() {
    this.orgSelectedLoaiBaoCao = 0;

    this._service.getLoaiBaoCaoDropdown().subscribe((rs) => {
      this.orgloaibaocao = rs;
    });
  }

  changeNoiDung() {
    if (this.orgSelectedState != 0) {
      this.IsHidden = true;
    } else this.IsHidden = false;
  }

  ChangeOrg(event) {
    //console.log(this.orgSelectedState);
    this.changeNoiDung();
  }
  getDoiTuong() {
    this.orgSelected = 0;
    //Lấy dữ liệu cây tổ chức
    this.doituongservice.getDoiTuongDropdown().subscribe((rs) => {
      this.org = rs;
    });
  }

  items: any[] = [];
  getAllDoiTuong() {
    this.tochucservice.getOrganizationUnitsViewDropdown(0).subscribe((rs) => {
      rs.forEach((el) => {
        this.items.push({ id: el.id.toString(), text: el.displayName });
      });
      this.doituongs = [...this.items];
    });
  }

  getAllToChucs() {
    this.tochucservice.getOrganizationUnitsViewDropdown(0).subscribe((rs) => {
      rs.forEach((el) => {
        this.items.push({ id: el.id.toString(), text: el.displayName });
      });
      this.tochucs = [...this.items];
    });
  }

  getSuKien() {
    this.orgSuKienSelect = 0;
    //Lấy dữ liệu cây tổ chức
    this.sukienservice.getSuKienDropdown().subscribe((rs) => {
      this.orgSuKien = rs;
    });
  }

  getState() {
    // this.orgSelectedState =-1;

    this._service.getStateDuyetBaoCaoDropdown().subscribe((rs) => {
      this.orgstate = rs;
    });
  }
  getToChucByDoiTuong(iddoituong) {
    // this.orgSelectToChuc = 0;
    //Lấy dữ liệu cây tổ chức
    this.tochucservice
      .getOrganizationUnitsByDoiTuongViewDropdown(iddoituong)
      .subscribe((rs) => {
        this.orgtochuc = rs;
        this.orgSelectedDonViChuTri = rs[0].id;
      });
  }

  ChangeToChuc(event) {
    this.getToChucByDoiTuong(this.orgSelected);
  }

  quaylai = function () {
    if (this.guibaocao == true) location.href = "app/pakns";
    else location.href = "app/duyetbaocaos";
  };

  saveHistory(idpakn) {
    this.history.nguoiTao = this.appSession.userId;
    this.id = this.route.snapshot.paramMap.get("id");
    this.history.paknId = idpakn;
    this.history.ngayTao = moment(new Date());
    this.history.noiDung = this.pakn.noiDungPheDuyet;
    this.history.trangThai = this.pakn.state;
    this.historyservice.insert(this.history).subscribe(
      (rs) => {
        this.onSave.emit();
        if (this.guibaocao == true) location.href = "app/pakns";
        else location.href = "app/duyetbaocaos";
      },
      () => {
        this.saving = false;
      }
    );
  }
  save() {
    if (this.duyetbaocao == true && this.orgSelectedState == 0) {
      alert("Phải chọn trạng thái phê duyệt báo cáo");
      return;
    }

    this.saving = true;
    this.pakn.doiTuongId = this.orgSelected;

    this.pakn.paknOrg = this.orgSelectToChuc;
    // var lat = parseFloat(jQuery("#lat").val().toString()) || 0;
    // var lng = parseFloat(jQuery("#lng").val().toString()) || 0;
    this.pakn.type = this.orgSelectedLoaiBaoCao;
    this.pakn.organizationUnitId = this.orgSelectedDonViChuTri;
    if (this.orgSelectedTinh == "0") this.pakn.ma_dvhc_t = "0";
    else this.pakn.ma_dvhc_t = this.orgSelectedTinh.toString();

    if (this.orgSelectedHuyen == "0") this.pakn.ma_dvhc_h = "0";
    else this.pakn.ma_dvhc_h = this.orgSelectedHuyen.toString();

    if (this.orgSelectedXa == "0") this.pakn.ma_dvhc_x = "0";
    else this.pakn.ma_dvhc_x = this.orgSelectedXa.toString();
    if (this.guibaocao == true) {
      this.pakn.state = 1;
      this.pakn.idUserSend = this.appSession.user.id;
    } else if (this.duyetbaocao == true) {
      this.pakn.state = this.orgSelectedState;
      this.pakn.idUserSend = this.pakn.idUserSend;
    }
    // this.pakn.lat = lat;
    // this.pakn.lng = lng;
    if (this.id == 0 || this.id == undefined) {
      this._service.insert(this.pakn).subscribe(
        () => {
          this.notify.info(this.l("SavedSuccessfully"));
          //  this.saveHistory(rs);
          this.onSave.emit();
          //location.href = "app/duyetbaocaos"; //truongpm change
          // location.href = "app/pakns";
        },
        () => {
          this.saving = false;
        }
      );
    } else {
      this._service.update(this.pakn).subscribe(
        () => {
          this.notify.info(this.l("SavedSuccessfully"));
          this.saveHistory(this.id);
          this.onSave.emit();
          //location.href = "app/duyetbaocaos";
          //  location.href = "app/pakns";
        },
        () => {
          this.saving = false;
        }
      );
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
}
