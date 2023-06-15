import { Moment } from "moment";
import {
  OrganizationUnit,
  User,
} from "./../../../shared/service-proxies/service-proxies";
import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectorRef,
} from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import {
  forEach as _forEach,
  includes as _includes,
  map as _map,
} from "lodash-es";
import { AppComponentBase } from "@shared/app-component-base";
import {
  UserServiceProxy,
  UserDto,
  RoleDto,
  OrganizationUnitServiceServiceProxy,
  OrganizationUnitDto,
} from "@shared/service-proxies/service-proxies";
import { Select2OptionData } from "ng-select2";
import { AppInitService } from "services/app-init.service";
import { Options } from "select2";
import * as moment from "moment";
import { IMyDate, IMyDpOptions } from "mydatepicker";
import { FormControl } from "@angular/forms";
@Component({
  templateUrl: "./edit-user-dialog.component.html",
})
export class EditUserDialogComponent
  extends AppComponentBase
  implements OnInit
{
  saving = false;
  user = new UserDto();
  roles: RoleDto[] = [];
  organs: OrganizationUnitDto[] = [];
  checkedRolesMap: { [key: string]: boolean } = {};
  checkedOrgransMap = {};
  id: number;
  org: any;
  orgSelected: string[] = [];
  role_: any[] = [];
  response: { dbPath: "" };
  @Output() onSave = new EventEmitter<any>();
  items: any;
  dataOrgs: any[] = [];
  datas: any[] = [];
  fileImageUrl: string;
  items_chucvu: any[] = [];
  chucDanhSelected: number;
  data_chucDanh: any[] = [];
  organization: OrganizationUnit[] = [];
  public options: Options;
  public avatar: string;
  ngayCap = new Date();
  ngayHetHan = new Date();
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
    injector: Injector,
    public _userService: UserServiceProxy,
    public bsModalRef: BsModalRef,
    private organizationService: OrganizationUnitServiceServiceProxy,
    private config: AppInitService,
    private ref: ChangeDetectorRef
  ) {
    super(injector);
    this.fileImageUrl = this.config.baseUrl.imgUrl;
    this.options = {
      multiple: true,
      tags: true,
    };
  }

  async ngOnInit(): Promise<void> {
    this.getOrganization();
    this.getChucDanh();
    if (this.id != undefined) {
      this._userService.getUser_ById(this.id).subscribe((rs) => {
        this.user = rs;
        this.setInitialRolesStatus();
        // this.avatar =  rs.avatar!=null? rs.avatar:"/Resources/Images/user.png";
        this.chucDanhSelected = rs.chucDanhId != undefined ? rs.chucDanhId : 0;
        this.orgSelected = rs.userOrg;
        // this.ngayCap =new Date(rs.ngayHetHan.toISOString());
        // this.ngayHetHan =  new Date(rs.ngayHetHan.toISOString());
        let d = new Date(rs.ngayCap.toISOString());
        this.selDate = {
          year: Number(d.getFullYear()),
          month: Number(d.getMonth() + 1),
          day: Number(d.getDate()),
        };
        this.startDate =
          this.selDate.day + "/" + this.selDate.month + "/" + this.selDate.year;

        //end day
        if (rs.ngayHetHan != null) {
          let e = new Date(rs.ngayHetHan.toISOString());
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
    this._userService.getRoles().subscribe((result2) => {
      this.roles = result2.items;
      this.setInitialRolesStatus();
    });
  }

  ChangeOrg($event) {
    // console.log(this.orgSelected)
  }
  getChucDanh() {
    this._userService.getChucDanh().subscribe((rs) => {
      rs.forEach((el) => {
        this.items_chucvu.push({ id: el.id.toString(), text: el.tenChucDanh });
      });
      if (this.data_chucDanh != undefined || this.data_chucDanh != null) {
        this.data_chucDanh = [...this.items_chucvu];
      }
    });
  }
  getOrganization() {
    //this.orgSelected=0;
    //Lấy dữ liệu cây tổ chức
    this.organizationService
      .getOrganizationUnitsViewDropdown(0)
      .subscribe((rs) => {
        rs.forEach((el) => {
          this.dataOrgs.push({ id: el.id.toString(), text: el.displayName });
        });
        this.datas = [...this.dataOrgs];
      });
  }
  setInitialRolesStatus(): void {
    _map(this.roles, (item) => {
      this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
        item.normalizedName
      );
    });
  }

  isRoleChecked(normalizedName: string): boolean {
    //console.log(this.user.roleNames);
    return _includes(this.user.roleNames, normalizedName);
  }

  onRoleChange(role: RoleDto, $event) {
    this.checkedRolesMap[role.normalizedName] = $event.target.checked;
  }

  getCheckedRoles(): string[] {
    const roles: string[] = [];
    _forEach(this.checkedRolesMap, function (value, key) {
      if (value) {
        roles.push(key);
      }
    });
    return roles;
  }

  save(): void {
    this.saving = true;
    //this.user.userOrg = this.orgSelected;
    this.organization = [];
    this.orgSelected.forEach((r) => {
      let item = new OrganizationUnit();
      item.id = parseInt(r);
      this.organization.push(item);
      this.user.userOrg = this.orgSelected;
    });
    this.user.chucDanhId = this.chucDanhSelected;
    this.user.roleNames = this.getCheckedRoles();
    //check ngày bắt đầu
    if (this.startDate != "0/0/0" && this.startDate != undefined) {
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
      this.user.ngayCap = moment(startday);
    } else {
      this.user.ngayCap = null;
    }

    //check ngày hết hạn
    if (this.endDate != undefined && this.endDate != "0/0/0") {
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
        this.user.ngayHetHan = moment(endday);
      } else {
        this.notify.error("Định dạng sai ngày tháng năm");
        this.saving = false;
        return;
      }
      this.user.ngayHetHan = moment(endday);
    } else {
      this.user.ngayHetHan = null;
    }

    //this.user.avatar=this.response!=undefined?this.response.dbPath:"Resources/images/user.png";
    this._userService.update(this.user).subscribe(
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
  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  uploadFinished = (event) => {
    this.response = event;
  };
  // updateDateNgayCap(event: any) {
  //   this.ngayCap = event.target.valueAsDate;
  //   //this.minNgayHetHan =new Date(this.ngayCap).toISOString().slice(0, 16);
  // }
  // updateDateNgayHetHan(event: any) {
  //   this.ngayHetHan = event.target.valueAsDate;
  // }
  //onchang ngày bắt đầy
  onDateChanged($event) {
    let d = $event.date;
    //console.log($event.date.day);
    this.startDate = d.day + "/" + d.month + "/" + d.year;
  }
  onChange($event) {
    //console.log("vào onchange.");
    this.startDate = $event.target.value;
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
