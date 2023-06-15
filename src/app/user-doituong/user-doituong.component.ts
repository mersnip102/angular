import { Component, Injector, OnInit } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { PagedRequestDto } from "@shared/paged-listing-component-base";
import {
  DoiTuongDto,
  DoiTuongServiceProxy,
  ObjDoiTuong,
  UserDoiTuong,
  UserDoiTuongDto,
  UserDoiTuongServiceServiceProxy,
  UserDoiTuongViewDto,
  UserServiceProxy,
  UserViewDto,
  OrganizationUnitServiceServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { BsModalService } from "ngx-bootstrap/modal";
import { finalize } from "rxjs/operators";
import {
  doituonginfo,
  doituonginfoInput,
  DoiTuongUser,
} from "shared/models/doituonginfo";
import { FormBuilder, FormGroup, FormArray, FormControl } from "@angular/forms";
import * as moment from "moment";
import { result } from "lodash-es";
import { DatePipe } from "@angular/common";
import { Select2OptionData } from "ng-select2";
import { readSync } from "fs";
import { TypeReportPAKN } from "@shared/constant/constant";
import { IMyDate, IMyDpOptions } from "mydatepicker";
@Component({
  selector: "app-user-doituong",
  templateUrl: "./user-doituong.component.html",
  styleUrls: ["./user-doituong.component.css"],
})
export class UserDoituongComponent extends AppComponentBase implements OnInit {
  form: FormGroup;
  users: UserDoiTuongViewDto[] = [];
  keyword = "";
  isActive: boolean = false;
  noiDung: any;
  ngayNhacViec: any;
  skipCount: 0;
  maxResultCount: 100;
  doiTuong: any;
  doituongs: DoiTuongDto[] = [];
  doituongchecked: doituonginfo[] = [];
  doituonginfoInput: doituonginfoInput[] = [];
  doituongUser: UserDoiTuongDto = new UserDoiTuongDto();
  saving = false;
  userid: 0;
  styleUser: any;
  objSelected: ObjDoiTuong[] = [];
  userdoituongs: UserDoiTuong[] = [];
  keyWord: string;
  orgId: number;
  update: boolean | false;
  datas: Array<Select2OptionData>;
  selectedOrg: number;
  items: any[] = [];
  typeReportSelected: number;
  isCheckDoiTuong: boolean = false;
  startDate: string;
  public selDate: IMyDate[];
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
  typeReportPAKN: typeof TypeReportPAKN = TypeReportPAKN;
  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
    private _modalService: BsModalService,
    private _doituongService: DoiTuongServiceProxy,
    private _userDoiTuongService: UserDoiTuongServiceServiceProxy,
    private orgService: OrganizationUnitServiceServiceProxy,
    private fb: FormBuilder
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getUser();
  }
  getOrganization() {
    this.selectedOrg = 0;
    //Lấy dữ liệu cây tổ chức
    this.orgService.getOrganizationUnitsViewDropdown(0).subscribe((rs) => {
      rs.forEach((el) => {
        this.items.push({ id: el.id.toString(), text: el.displayName });
      });
      this.datas = [...this.items];
      this.datas.push({ id: "0", text: "--Chọn tổ chức--" });
    });
  }
  getUser(): void {
    this._userDoiTuongService
      .getUserView(this.keyWord, this.selectedOrg)
      .subscribe((rs) => {
        this.users = rs;
      });
  }
  getUserDoiTuong(): void {
    this._userDoiTuongService.getUserDoiTuong().subscribe((result) => {
      result.forEach((rs) => {
        if (this.userid == rs.userId) this.update = true;
      });
    });
  }
  getDoiTuong(userId: any): void {
    this.doituonginfoInput = [];

    this._userDoiTuongService
      .getDoiTuongUserEmpty(userId)
      .subscribe((result) => {
        result.forEach((rs) => {
          var input = new doituonginfoInput();
          input.id = rs.id;
          input.name = rs.name;
          input.isActive = rs.isActive;
          input.isChecked = rs.isActive;
          //input.ngayNhacViec = rs.ngayNhacViec!= null ? moment(rs.ngayNhacViec) : null;
          input.nhacTruoc = rs.nhacTruoc;
          input.noiDung = rs.noiDung;
          input.type = rs.type;
          if (rs.ngayNhacViec != null) {
            let d = new Date(rs.ngayNhacViec.toISOString());
            let date: IMyDate = {
              year: Number(d.getFullYear()),
              month: Number(d.getMonth() + 1),
              day: Number(d.getDate()),
            };
            input.ngayNV = date;
          }
          this.doituonginfoInput.push(input);
        });
      });
  }
  callDoiTuong(id: any, i: number) {
    this.userid = id;
    this.getDoiTuong(id);
    this.update = false;
    this.getUserDoiTuong();
  }
  onChange(item: doituonginfoInput) {
    this.isCheckDoiTuong = item.isChecked;
    item.isActive = false;
    item.ngayNhacViec = null;
    item.nhacTruoc = 0;
    item.noiDung = null;
  }
  save() {
    if (this.userid == undefined) {
      this.notify.error("Chưa chọn người dùng nào để cấu hình !");
      return;
    }
    this.objSelected = [];
    this.doituonginfoInput.forEach((rs) => {
      if (rs.isChecked == true) {
        var s = new ObjDoiTuong();
        s.doiTuongId = rs.id;
        s.isActive = rs.isActive;
        rs.ngayNV = {
          year: Number(rs.ngayNV.year),
          month: Number(rs.ngayNV.month - 1),
          day: Number(rs.ngayNV.day),
        };
        s.mocDauTien = moment(rs.ngayNV);
        s.nhacTruoc = rs.nhacTruoc;
        s.noiDung = rs.noiDung;
        s.type = rs.type;
        this.objSelected.push(s);
      }
    });
    //check các thông tin liên quan

    if (this.objSelected.length == 0) {
      this.notify.error("Chưa chọn đối tượng !");
      return;
    } else {
      this.doituongUser.userId = this.userid;
      this.doituongUser.objDoiTuong = this.objSelected;
    }

    if (this.update == true) {
      let error = false;
      this.doituongUser.objDoiTuong.forEach((rs) => {
        if (rs.type != this.typeReportPAKN.DotXuat) {
          if (!rs.mocDauTien.isValid()) {
            error = true;
            this.notify.error("Chưa nhập ngày nhắc việc!");
            return;
          } else if (rs.isActive == false) {
            error = true;
            this.notify.error("Chưa chọn trạng thái !");
            return;
          } else if (rs.nhacTruoc == null) {
            error = true;
            this.notify.error("Chưa nhập nhắc việc trước ngày!");
            return;
          } else if (rs.noiDung === null || rs.noiDung === "") {
            error = true;
            this.notify.error("Chưa nhập nội dung!");
            return;
          }
        } else {
          rs.isActive = true;
          rs.mocDauTien = null;
          rs.nhacTruoc = 0;
          rs.noiDung = null;
        }
      });
      if (error == false) {
        this._userDoiTuongService.update(this.doituongUser).subscribe((rs) => {
          this.notify.success("Thành công!");
          this.getDoiTuong(this.doituongUser.userId);
          this.getUser();
        });
      }
    } else {
      let errorThem = false;
      this.doituongUser.objDoiTuong.forEach((rs) => {
        if (rs.type != this.typeReportPAKN.DotXuat) {
          if (!rs.mocDauTien.isValid()) {
            errorThem = true;
            this.notify.error("Chưa nhập ngày nhắc việc!");
            return;
          } else if (rs.isActive == false) {
            errorThem = true;
            this.notify.error("Chưa chọn trạng thái !");
            return;
          } else if (rs.nhacTruoc == null) {
            errorThem = true;
            this.notify.error("Chưa nhập nhắc việc trước ngày!");
            return;
          } else if (rs.noiDung === null || rs.noiDung === "") {
            errorThem = true;
            this.notify.error("Chưa nhập nội dung!");
            return;
          }
        } else {
          rs.isActive = true;
          rs.mocDauTien = null;
          rs.nhacTruoc = 0;
          rs.noiDung = null;
        }
      });
      if (errorThem == false) {
        this._userDoiTuongService.update(this.doituongUser).subscribe((rs) => {
          this.notify.success("Thêm mới thành công!");
          this.getDoiTuong(this.doituongUser.userId);
        });
      }
    }
    //load lại
  }
  updatedate($event, item: doituonginfoInput) {
    item.ngayNhacViec = moment($event);
    this.ngayNhacViec = moment($event);
  }
  onChangeType(item: doituonginfoInput): boolean {
    if (item.type == 0) {
      return false;
    } else {
      return true;
    }
  }
  onChangeActive(item: doituonginfoInput) {
    this.isActive = item.isActive;
  }
  onChangeNoiDung(item: doituonginfoInput) {
    this.noiDung = item.noiDung;
  }
  //onchang ngày bắt đầy
  onDateChanged($event, item: doituonginfoInput) {
    let d = $event.date;
    item.ngayNV = d;
  }
  onChanges($event, item: doituonginfoInput) {
    let d = $event.target.value.split("/");
    let startday = d[1] + "/" + d[0] + "/" + d[2];
    // console.log(isNaN(new Date(startday) as any));
    if (!isNaN(new Date(startday) as any)) {
      if (d[2].length > 4) {
        this.notify.error("Định dạng sai ngày tháng năm");
      } else {
        let e = new Date(startday);
        item.ngayNV = {
          year: Number(e.getFullYear()),
          month: Number(e.getMonth() + 1),
          day: Number(e.getDate()),
        };
      }
    } else {
      this.notify.error("Chưa định dạng đúng ngày dd/mm/yyyy");
    }
  }
}
