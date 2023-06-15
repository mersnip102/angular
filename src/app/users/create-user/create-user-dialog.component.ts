import { IMyDate, IMyDpOptions } from "mydatepicker";
import {
  OrganizationUnitServiceServiceProxy,
  OrganizationViewTreeDto,
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
import { forEach as _forEach, map as _map, result } from "lodash-es";
import { AppComponentBase } from "@shared/app-component-base";
import {
  UserServiceProxy,
  CreateUserDto,
  RoleDto,
} from "@shared/service-proxies/service-proxies";
import { AbpValidationError } from "@shared/components/validation/abp-validation.api";
import { TreeviewItem } from "ngx-treeview";
import { Select2OptionData } from "ng-select2";
import { Options } from "select2";
import { FormBuilder, Validators } from "@angular/forms";
import * as moment from "moment";

@Component({
  templateUrl: "./create-user-dialog.component.html",
})
export class CreateUserDialogComponent
  extends AppComponentBase
  implements OnInit
{
  response: { dbPath: "" };
  saving = false;
  user = new CreateUserDto();
  roles: RoleDto[] = [];
  organs: OrganizationViewTreeDto[] = [];
  checkedRolesMap: { [key: string]: boolean } = {};
  defaultRoleCheckedStatus = false;
  items: any[] = [];
  items_chucDanh: any[] = [];
  org: any;
  orgSelected: any;
  ChuDanhSelected: number;
  public options: Options;
  passwordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: "pattern",
      localizationKey:
        "PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber",
    },
  ];
  confirmPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: "validateEqual",
      localizationKey: "PasswordsDoNotMatch",
    },
  ];

  @Output() onSave = new EventEmitter<any>();
  datas: Array<Select2OptionData>;
  data_ChucDanh: Array<Select2OptionData>;
  id: number;
  isDefaultImage: boolean = true;
  public avatar: string;
  isOrgSelect = false;
  ngayCap = new Date();
  ngayHetHan = new Date();
  minNgayHetHan = new Date().toISOString().slice(0, 16);
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
    private ref: ChangeDetectorRef,
    public fb: FormBuilder
  ) {
    super(injector);
    this.options = {
      multiple: true,
      tags: true,
    };
  }

  ngOnInit(): void {
    this.isDefaultImage = true;
    this.user.isActive = true;
    // this.ngayCap = new Date();
    this.avatar = "Resources/images/user.png";
    this._userService.getRoles().subscribe((result) => {
      this.roles = result.items;
      this.setInitialRolesStatus();
    });
    //Gọi cây
    this.getOrganization();
    this.getChucDanh();
    if (this.id != undefined) {
      //this.getUserById();
    }
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
  ChangeOrg($event) {
    // console.log(this.orgSelected)
  }
  getOrganizationByID() {
    this.organizationService
      .getOrganizationUnitsById(this.id)
      .subscribe((rs) => {
        this.org = rs;
        this.orgSelected = rs.parentId;
      });
  }
  getOrganization() {
    this.orgSelected = 0;
    //Lấy dữ liệu cây tổ chức
    this.organizationService
      .getOrganizationUnitsViewDropdown(0)
      .subscribe((rs) => {
        rs.forEach((el) => {
          this.items.push({ id: el.id.toString(), text: el.displayName });
        });
        this.datas = [...this.items];

        if (this.id != undefined) {
          this.getOrganizationByID();
        } else this.orgSelected = rs != null ? rs[0].id : 0;
      });
  }
  getChucDanh() {
    this._userService.getChucDanh().subscribe((rs) => {
      rs.forEach((el) => {
        this.items_chucDanh.push({
          id: el.id.toString(),
          text: el.tenChucDanh,
        });
      });
      this.data_ChucDanh = [...this.items_chucDanh];
    });
  }
  getItems(parentChildObj) {
    let itemsArray = [];
    parentChildObj.forEach((set) => {
      itemsArray.push(new TreeviewItem(set));
    });
    return itemsArray;
  }

  setInitialRolesStatus(): void {
    _map(this.roles, (item) => {
      this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
        item.normalizedName
      );
    });
  }

  isRoleChecked(normalizedName: string): boolean {
    // just return default role checked status
    // it's better to use a setting
    return this.defaultRoleCheckedStatus;
  }

  onRoleChange(role: RoleDto, $event) {
    this.checkedRolesMap[role.normalizedName] = $event.target.checked;
  }

  getCheckedRoles(): string[] {
    const roles: string[] = [];
    _forEach(this.checkedRolesMap, function (value, key) {
      if (value) {
        roles.push(key);
        //console.log(roles);
      }
    });
    return roles;
  }
  updatedate($event, item: CreateUserDto) {
    item.ngayCap = moment($event);
    item.ngayHetHan = moment($event);
  }

  save(): void {
    if (this.orgSelected == 0) {
      //console.log(this.orgSelected )
      this.isOrgSelect = true;
      return;
    } else {
      this.isOrgSelect = false;
      this.saving = true;
      this.user.userOrg = this.orgSelected;
      //this.user.avatar=this.response!=undefined?this.response.dbPath:"Resources/images/user.png";
      this.user.roleNames = this.getCheckedRoles();
      this.user.chucDanhId = this.ChuDanhSelected;

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
      if (this.endDate != "0/0/0" && this.endDate != undefined) {
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

      this._userService.create(this.user).subscribe(
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
  uploadFinished = (event) => {
    this.response = event;
  };
  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  // updateDateNgayCap(event: any) {
  //   this.ngayCap = event.target.valueAsDate;
  //   this.minNgayHetHan = new Date(this.ngayCap).toISOString().slice(0, 16);
  // }
  // updateDateNgayHetHan(event: any) {
  //   this.ngayHetHan = event.target.valueAsDate;
  // }
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
