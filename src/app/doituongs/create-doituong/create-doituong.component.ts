import {
  LoaiDoiTuongServiceServiceProxy,
  NhiemVuServiceServiceProxy,
  OrganizationUnitDto,
  OrganizationUnitServiceServiceProxy,
  OrganizationViewTreeDto,
  UserServiceProxy,
} from "./../../../shared/service-proxies/service-proxies";
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
  DoiTuongDto,
  DoiTuongServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ThrowStmt } from "@angular/compiler";
import { Select2OptionData } from "ng-select2";
import { Options } from "select2";
import * as moment from "moment";
import { IMyDate, IMyDpOptions } from "mydatepicker";

@Component({
  selector: "app-create-doituong",
  templateUrl: "./create-doituong.component.html",
  styleUrls: ["./create-doituong.component.css"],
})
export class CreateDoituongComponent
  extends AppComponentBase
  implements OnInit
{
  saving = false;
  doituong: DoiTuongDto = new DoiTuongDto();
  org: any;
  selectedOrg: number;
  id: number;
  items: any[] = [];
  items_user: any[] = [];
  data_user: Array<Select2OptionData>;
  userSelect: any;
  public options: Options;
  tochucSelect: any;
  tochuc: any;
  nhiemvu: any;
  nhiemvuSelect: any;
  loaidoituong: any;
  loaidoituongSelect: any;
  @Output() onSave = new EventEmitter<any>();
  isOrgSelect = false;
  ngayBatDau = new Date();
  ngayKetThuc = new Date();
  minNgayKetThuc = new Date().toISOString().slice(0, 16);
  valueTemp: string[] = [];
  startDate: any;
  endDate: any;
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
    public bsModalRef: BsModalRef,
    injector: Injector,
    public _doituongService: DoiTuongServiceProxy,
    private orgService: OrganizationUnitServiceServiceProxy,
    public _nhiemvuService: NhiemVuServiceServiceProxy,
    public _loaidoituongService: LoaiDoiTuongServiceServiceProxy,
    public _userService: UserServiceProxy,
    private cdref: ChangeDetectorRef
  ) {
    super(injector);
    this.options = {
      multiple: true,
      tags: true,
    };
  }

  ngOnInit(): void {
    //ngày bắt đầu
    let d: Date = new Date();
    this.selDate = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };
    this.startDate =
      this.selDate.day + "/" + this.selDate.month + "/" + this.selDate.year;

    this.nhiemvuSelect = 0;
    this.loaidoituongSelect = 0;
    this.tochucSelect = 0;
    this.getAllLoaiDoiTuong();
    this.getAllNhiemvu();
    this.getOrganization();
    if (this.id != undefined) {
      this.getDoiTuongById();
    } else {
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
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  getDoiTuongById() {
    this._doituongService.getById(this.id).subscribe((rs) => {
      this.tochucSelect = rs.organizationUnitId;
      this.getUserByTochuc();
      this.doituong = rs;
      // this.selectedOrg =rs.organizationUnitId != null ? this.doituong.organizationUnitId : 0;
      this.loaidoituongSelect = rs.loaiDoiTuongId;
      this.nhiemvuSelect = rs.nhiemVuId;
      this.userSelect = rs.user_Id;
      this.tochucSelect = rs.organizationUnitId;

      let d = new Date(rs.ngayBatDau.toISOString());
      this.selDate = {
        year: Number(d.getFullYear()),
        month: Number(d.getMonth() + 1),
        day: Number(d.getDate()),
      };
      this.startDate =
        this.selDate.day + "/" + this.selDate.month + "/" + this.selDate.year;
      //end day
      if (rs.ngayKetThuc != null) {
        let e = new Date(rs.ngayKetThuc.toISOString());
        this.endselDate = {
          year: Number(e.getFullYear()),
          month: Number(e.getMonth() + 1),
          day: Number(e.getDate()),
        };
        this.endDate =
          this.endselDate.day +
          "/" +
          this.endselDate.month +
          "/" +
          this.endselDate.year;
      }
    });
  }
  getOrganization() {
    this.selectedOrg = 0;
    //Lấy dữ liệu cây tổ chức
    this.orgService.getOrganizationUnitsViewDropdown(0).subscribe((rs) => {
      rs.forEach((el) => {
        this.items.push({ id: el.id.toString(), text: el.displayName });
      });
      this.tochuc = [...this.items];
      //console.log(this.tochuc)
    });
  }
  Changetochuc($event) {
    this.getUserByTochuc();
  }
  getOrganizationByID() {
    this.orgService.getOrganizationUnitsById(this.id).subscribe((rs) => {
      this.org = rs;
      this.selectedOrg = rs.parentId;
    });
  }
  getAllNhiemvu() {
    this._nhiemvuService.getNhiemVuList().subscribe((rs) => {
      this.nhiemvu = rs;
    });
  }
  getAllLoaiDoiTuong() {
    this._loaidoituongService.getLoaiDoiTuongList().subscribe((rs) => {
      this.loaidoituong = rs;
    });
  }
  getUserByTochuc() {
    this.items_user=[];
    this.userSelect=null;
    this._userService.getUserByToChuc(this.tochucSelect).subscribe((rs) => {
      rs.forEach((el) => {
        this.items_user.push({ id: el.id.toString(), text: el.userName });
      });
      this.data_user = [...this.items_user];
    });
  }

  save() {
    if (this.tochucSelect == 0) {
      //console.log(this.selectedOrg);
      this.isOrgSelect = true;
      return;
    } else {
      this.saving = true;
      this.doituong.organizationUnitId = this.tochucSelect;
      this.doituong.nhiemVuId = this.nhiemvuSelect;
      this.doituong.loaiDoiTuongId = this.loaidoituongSelect;
      //check ngày bắt đầu
      if(this.startDate !="0/0/0" && this.startDate !=undefined)
      {
        let d = this.startDate.split("/");
        let startday = d[1] + "/" + d[0] + "/" + d[2];
        if (d[2] != undefined) {
          if (d[2].length != 4) {
            this.notify.error("Định dạng sai ngày tháng năm");
            this.saving = false;
            return;
          } else if (isNaN(new Date(startday) as any)) {
            this.notify.error("Định dạng sai ngày tháng năm");
            this.saving = false;
            return;
          }
        } else {
          this.notify.error("Định dạng sai ngày tháng năm");
          this.saving = false;
          return;
        }
        this.doituong.ngayBatDau = moment(startday);
      }
      else
      { this.doituong.ngayBatDau=null;

      }
      //check ngày hết hạn
      if(this.endDate !="0/0/0" && this.endDate!=undefined)
      {
        let a = this.endDate.split("/");
        let endday = a[1] + "/" + a[0] + "/" + a[2];
        if (a[2] != undefined) {
          if (a[2].length != 4) {
            this.notify.error("Định dạng sai ngày tháng năm");
            this.saving = false;
            return;
          } else if (isNaN(new Date(endday) as any)) {
            this.notify.error("Định dạng sai ngày tháng năm");
            this.saving = false;
            return;
          }
        } else if (a[1] == undefined && a[0] == "" && a[2] == undefined) {
          this.doituong.ngayKetThuc = moment(endday);
        } else {
          this.notify.error("Định dạng sai ngày tháng năm");
          this.saving = false;
          return;
        }
        this.doituong.ngayKetThuc = moment(endday);
      }else
      {
        this.doituong.ngayKetThuc=null;
      }


      this.doituong.user_Id = this.userSelect;

      if (this.id == undefined) {
        this._doituongService.createDoiTuong(this.doituong).subscribe(
          () => {
            this.notify.info(this.l("SavedSuccessfully"));
            this.bsModalRef.hide();
            this.onSave.emit();
          },
          () => {
            this.saving = false;
          }
        );
      } else {
        this._doituongService.updateDoiTuong(this.doituong).subscribe(
          () => {
            this.notify.info(this.l("SavedSuccessfully"));
            this.bsModalRef.hide();
            this.onSave.emit();
          },
          () => {
            this.saving = false;
          }
        );
      }
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
    console.log("datechange:" + this.startDate);
  }
  onChangeEndDay($event) {
    //console.log("vào onchange.");
    this.endDate = $event.target.value;
    //console.log(this.startDate);
  }
}
