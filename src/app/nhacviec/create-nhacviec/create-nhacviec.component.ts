import {
  PAKNServiceProxy,
  UserDeviceServiceServiceProxy,
  FcmFirebaseServiceProxy,
  ObjNotification,
  OrganizationUnitServiceServiceProxy,
} from "@shared/service-proxies/service-proxies";
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
  NhacviecDto,
  NhacViecServiceServiceProxy,
  RoleServiceProxy,
  UserServiceProxy,
} from "@shared/service-proxies/service-proxies";
import * as moment from "moment";
import { Select2OptionData } from "ng-select2";
import { BsModalRef } from "ngx-bootstrap/modal";
import { stringify } from "querystring";
import { Options } from "select2";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NotifyCommonService } from "services/notify-common.service";
import NotifyCommon from "@shared/models/notifycommon";
import { Observable } from "ol";
import { event } from "jquery";
@Component({
  selector: "app-create-nhacviec",
  templateUrl: "./create-nhacviec.component.html",
  styleUrls: ["./create-nhacviec.component.css"],
})
export class CreateNhacviecComponent
  extends AppComponentBase
  implements OnInit
{
  org: any;
  orgSelected: any;
  userSelected: any;
  saving = false;
  numberValue: any[] = [];
  nhacviec: NhacviecDto = new NhacviecDto();
  @Output() onSave = new EventEmitter<any>();
  id: number;
  public users: Array<Select2OptionData>;
  public tochucs: Array<Select2OptionData>;
  public options: Options;
  value: string[] = [];
  valueTemp: string[] = [];
  userToChuc: number[] = [];
  userNhom: number[] = [];
  valueNumber: number[] = [];
  _notify: NotifyCommon[] = [];
  lstnhomnguoidung: any;
  SelectedNhomNguoiDung: number;
  CheckUser = false;
  //ckeditor

  items: any[] = [];
  item_tochucs: any[] = [];
  constructor(
    public bsModalRef: BsModalRef,
    injector: Injector,
    public _nhacviecService: NhacViecServiceServiceProxy,
    private userService: UserServiceProxy,
    private cdref: ChangeDetectorRef,
    private _fcMService: FcmFirebaseServiceProxy,
    private userDeviceService: UserDeviceServiceServiceProxy,
    public _service: PAKNServiceProxy,
    private _rolesService: RoleServiceProxy,
    private organizationService: OrganizationUnitServiceServiceProxy
  ) {
    super(injector);
    this.options = {
      multiple: true,
      tags: true,
    };
  }
  async ngOnInit(): Promise<void> {
    await this.getOrganization();
    await this.getNhomNguoiDung();
    if (this.id != undefined) {
      let rs = await this._nhacviecService.getById(this.id).toPromise();
      if (rs != undefined) {
        this.nhacviec = rs;
        this.orgSelected = rs.userOrg;
        this.SelectedNhomNguoiDung = rs.roleId;
        let user: string[] = [];
        rs.userIds.forEach(async (r) => {
          await user.push(r.toString());
        });
        this.userSelected = user; // this.userToChuc;
      }
    }
  }
  Changenhomnguoidung() {
    this.userSelected = [];
    this.getUserByToChuc();
  }
  Changetochuc() {
    this.userSelected = [];
    this.getUserByToChuc();
  }

  getallUser() {
    this.users = [];
    this.items = [];
    this._rolesService
      .getUsersByRoleID(this.SelectedNhomNguoiDung)
      .subscribe((rs) => {
        rs.forEach((el) => {
          this.items.push({ id: el.id.toString(), text: el.userName });
        });
        this.users = [...this.items];
        if (this.id != undefined) {
          this._nhacviecService.getById(this.id).subscribe((rs) => {
            this.nhacviec = rs;
            this.SelectedNhomNguoiDung = rs.roleId;
            if (rs.userIds.length > 0) {
              rs.userIds.forEach((n) => {
                this.valueTemp.push(n.toString());
              });
              this.value = this.valueTemp;
            }
          });
        }
      });
  }

  async getNhomNguoiDung() {
    this.SelectedNhomNguoiDung = 0;
    await this._rolesService.getListRole().subscribe((rs) => {
      this.lstnhomnguoidung = rs;
    });
  }
  //dungnb code
  async getUserByToChuc() {
    this.items = [];
    let nv = await this._nhacviecService
      .getUsersByToChucID(this.orgSelected, this.SelectedNhomNguoiDung)
      .toPromise();
    nv.forEach((r) => {
      this.items.push({ id: r.id.toString(), text: r.userName });
    });
    this.users = [...this.items];
  }
  async getOrganization() {
    this.orgSelected = 0;
    //Lấy dữ liệu cây tổ chức
    await this.organizationService
      .getOrganizationUnitsViewDropdown(0)
      .subscribe((rs) => {
        rs.forEach((el) => {
          this.item_tochucs.push({
            id: el.id.toString(),
            text: el.displayName,
          });
        });
        this.tochucs = [...this.item_tochucs];
      });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  //end dungnb code
  async save() {
    this.saving = true;
    //trường hợp ko chọn gì cả => lưu tất cả người dùng
    if (
      (this.userSelected == null ||
        this.userSelected == undefined ||
        this.userSelected.length == 0) &&
      this.SelectedNhomNguoiDung == 0 &&
      (this.orgSelected == 0 || this.orgSelected == null)
    ) {
      let v = await this._nhacviecService
        .getUsersByToChucID(this.orgSelected, this.SelectedNhomNguoiDung)
        .toPromise();
      v.forEach(async (r) => {
        await this.valueNumber.push(r.id);
      });
      this.nhacviec.userIds = this.valueNumber;
      //trường hợp chỉ chọn nhóm => lưu tất cả người dùng thuộc nhóm
    } else if (this.SelectedNhomNguoiDung != 0) {
      this.userNhom = [];
      let v = await this._nhacviecService
        .getUsersByToChucID(this.orgSelected, this.SelectedNhomNguoiDung)
        .toPromise();
      v.forEach(async (r) => {
        await this.userNhom.push(r.id);
      });
      //không chọn người dùng => lưu tất cả người dùng thuộc nhóm
      if (this.userSelected.length == 0) {
        this.nhacviec.userIds = this.userNhom;
      } //chọn người dùng => chỉ lưu người dùng
      else {
        this.nhacviec.userIds = this.userSelected;
      }
      //trường hợp chỉ chọn tổ chức => lưu tất cả người dùng thuộc tổ chức
    } else if (this.orgSelected != 0) {
      this.userToChuc = [];
      let v = await this._nhacviecService
        .getUsersByToChucID(this.orgSelected, this.SelectedNhomNguoiDung)
        .toPromise();
      v.forEach(async (r) => {
        await this.userToChuc.push(r.id);
      });
      //không chọn người dùng => lưu tất cả người dùng thuộc tổ chức
      if (this.userSelected.length == 0) {
        this.nhacviec.userIds = this.userToChuc;
      } //chọn người dùng => chỉ lưu người dùng
      else {
        this.nhacviec.userIds = this.userSelected;
      }
    }
    //trường hợp chọn tất cả
    else {
      this.userSelected.forEach(async (rs) => {
        await this.valueNumber.push(Number(rs));
      });
      this.nhacviec.userIds = this.valueNumber;
    }
    this.nhacviec.userOrg = this.orgSelected;
    this.nhacviec.roleId = this.SelectedNhomNguoiDung;

    if (this.id == 0 || this.id == undefined) {
      //this.CheckUser = false;
      this._nhacviecService.insert(this.nhacviec).subscribe(
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
      this._nhacviecService.update(this.nhacviec).subscribe(
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

    // //push on firebase NotifyCommon

    this.nhacviec.userIds.forEach((rs) => {
      this.userDeviceService.getListDevice(rs).subscribe((r) => {
        console.log(r);
        let n = new ObjNotification();
        n.body = this.nhacviec.noiDung;
        n.title = this.nhacviec.tieuDe;
        n.registration_ids = r;
        this._fcMService.fcmFireBaseFushNotify(n).subscribe((res) => {});
      });
    });
  }
}
