

import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedRequestDto } from '@shared/paged-listing-component-base';
import { DoiTuongDto, DoiTuongServiceProxy, ObjDoiTuong, XemUserDoiTuong, XemUserDoiTuongDto, XemUserDoiTuongServiceServiceProxy, XemUserDoiTuongViewDto, UserServiceProxy, UserViewDto, OrganizationUnitServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { doituonginfo, doituonginfoInput, DoiTuongUser } from 'shared/models/doituonginfo';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { result } from 'lodash-es';
import { DatePipe } from '@angular/common';
import { Select2OptionData } from 'ng-select2';
import { readSync } from 'fs';
import { TypeReportPAKN } from '@shared/constant/constant'
@Component({
  selector: 'app-user-doituong-xem',
  templateUrl: './user-doituong-xem.component.html',
  styleUrls: ['./user-doituong-xem.component.css']
})

export class UserDoituongXemComponent extends AppComponentBase implements OnInit {
  form: FormGroup;
  users: XemUserDoiTuongViewDto[] = [];
  keyword = '';
  isActive: boolean | null;
  skipCount: 0;
  maxResultCount: 100;
  doiTuong: any;
  doituongs: DoiTuongDto[] = [];
  doituongchecked: doituonginfo[] = [];
  doituonginfoInput: doituonginfoInput[] = [];
  doituongUser: XemUserDoiTuongDto = new XemUserDoiTuongDto();
  saving = false;
  userid: 0;
  styleUser: any;
  objSelected: ObjDoiTuong[] = [];
  userdoituongs: XemUserDoiTuong[] = [];
  keyWord: string;
  orgId: number;
  update: boolean | false;
  datas: Array<Select2OptionData>;
  selectedOrg: number;
  items: any[] = [];
  typeReportSelected: number;
  typeReportPAKN: typeof TypeReportPAKN = TypeReportPAKN;
  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
    private _modalService: BsModalService,
    private _doituongService: DoiTuongServiceProxy,
    private _xemuserDoiTuongService: XemUserDoiTuongServiceServiceProxy,
    private orgService: OrganizationUnitServiceServiceProxy,
    private fb: FormBuilder,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getUser();
    this.getOrganization();
    // this.form = this.fb.group({
    //   name: this.fb.array([])
    // });
  }
  getOrganization() {
    this.selectedOrg = 0;
    //Lấy dữ liệu cây tổ chức
    this.orgService.getOrganizationUnitsViewDropdown(0).subscribe(rs => {

      rs.forEach(el => {
        this.items.push({ 'id': el.id.toString(), 'text': el.displayName });
      });
      this.datas = [...this.items];
      this.datas.push({ 'id': '0', 'text': '--Chọn tổ chức--' });
    })
  };
  getUser(): void {
    // console.log("this.orgId", this.selectedOrg)
    this._xemuserDoiTuongService.getUserView(this.keyWord, this.selectedOrg).subscribe(rs => {
      this.users = rs;
    })
  }
  getUserDoiTuong(): void {
    this._xemuserDoiTuongService.getUserDoiTuong()
      .subscribe((result) => {
        result.forEach(rs => {
          if (this.userid == rs.userId)
            this.update = true;
        })
      });
  }
  getDoiTuong(userId: any): void {
    this.doituonginfoInput = [];
    this._xemuserDoiTuongService.getDoiTuongUserEmpty(userId)
      .subscribe((result) => {
        result.forEach(rs => {
          var input = new doituonginfoInput();
          input.id = rs.id;
          input.name = rs.name;
          input.isActive = true;
          input.isChecked = rs.isActive;
          
          this.doituonginfoInput.push(input);

        })
      });
  }
  callDoiTuong(id: any, i: number) {

    this.userid = id;
    this.getDoiTuong(id);
    this.update = false;
    this.getUserDoiTuong();
  }
  onChange(item: doituonginfoInput) {
    item.isActive = true;
    item.ngayNhacViec = null;
    item.nhacTruoc = 0;
    item.noiDung = null;
  }
  save() {
    this.objSelected = [];
    this.doituonginfoInput.forEach(rs => {
      if (rs.isChecked == true) {
        var s = new ObjDoiTuong();
        s.doiTuongId = rs.id;
        s.isActive = true;
        this.objSelected.push(s);
      }
    })
    console.log("this.doituonginfoInput",this.doituonginfoInput);
    this.doituongUser.userId = this.userid;
    this.doituongUser.objDoiTuong = this.objSelected;
    // console.log(this.doituongUser);
    //check các thông tin liên quan
    if (this.userid == null) {
      this.notify.error("Chưa chọn người dùng nào để cấu hình !");
      return;
    }

    if (this.update == true) {
      let error = false;
      this.doituongUser.objDoiTuong.forEach(rs => {
      });
      if (error == false) {
        this._xemuserDoiTuongService.updateAsyncXem(this.doituongUser).subscribe(rs => {
          this.notify.success("Thành công!");
          this.getDoiTuong(this.doituongUser.userId);
        })
      }
    }


    else {
      let errorThem = false;
      this.doituongUser.objDoiTuong.forEach(rs => {
        
      });
      if (errorThem == false) {
        this._xemuserDoiTuongService.updateAsyncXem(this.doituongUser).subscribe(rs => {
          this.notify.success("Thêm mới thành công!");
          this.getDoiTuong(this.doituongUser.userId);
          //errorThem == true;
        })
      }
    }
  }
  updatedate($event, item: doituonginfoInput) {
    item.ngayNhacViec = moment($event);
    // const dateSendingToServer = new DatePipe('en-US').transform($event, 'dd/MM/yyyy')
    // const date = moment($event).format("dd-MM-yyyy");
    // $event = date;
    // console.log(date)
  }
  onChangeType(item: doituonginfoInput): boolean {
    // item.isActive = false;
    // item.ngayNhacViec = null;
    // item.nhacTruoc = 0;
    // item.noiDung = null;
    if (item.type == 0) {
      return false;
    }
    else {
      return true;
    }
  }
}


