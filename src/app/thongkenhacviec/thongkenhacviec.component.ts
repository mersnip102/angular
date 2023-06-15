import {
  NotifyServiceServiceProxy,
  UserServiceProxy,
} from "./../../shared/service-proxies/service-proxies";
import { Component, Injector, OnInit } from "@angular/core";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "@shared/paged-listing-component-base";
import { ThongKeNhacViecDto } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { appModuleAnimation } from "@shared/animations/routerTransition";

class PagedThongKeResultRequestDto extends PagedRequestDto {
  keyword: string;
  UserId: number;
  Id_NguoiBaoCao: number;
  Id_DoiTuong: number;
}

@Component({
  selector: "app-thongkenhacviec",
  templateUrl: "./thongkenhacviec.component.html",
  styleUrls: ["./thongkenhacviec.component.css"],
  animations: [appModuleAnimation()],
})
export class ThongkenhacviecComponent extends PagedListingComponentBase<ThongKeNhacViecDto> {
  protected delete(entity: ThongKeNhacViecDto): void {
    throw new Error("Method not implemented.");
  }
  id: any;
  data: ThongKeNhacViecDto[] = [];
  ddlNguoibaoCao: any;
  ddlNguoibaoCaoSelect: number;
  ddlDoiTuong: any;
  ddlDoiTuongSelected: number;
  keyword = "";
  UserId: number;
  Id_NguoiBaoCao: number;
  Id_DoiTuong: number;
  items: any[] = [];
  checkNhomNguoiDung: number;
  nguoibaocao: any;
  doituong: any;
  constructor(
    injector: Injector,
    private _notifyService: NotifyServiceServiceProxy
  ) {
    super(injector);
    this.ddlNguoibaoCaoSelect = 0;
    this.ddlDoiTuongSelected = 0;
    this.getUserBC();
  }
  // async ngOnInit(): Promise<void> {
  //   this.ddlDoiTuongSelected = 0;
  //   this.getUserBC();
  // }
  protected list(
    request: PagedThongKeResultRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    (request.keyword = this.keyword),
      (request.UserId = this.appSession.user.id);
    (request.Id_NguoiBaoCao = this.ddlNguoibaoCaoSelect),
      (request.Id_DoiTuong = this.ddlDoiTuongSelected),
      this._notifyService
        .getAllDataByUser(
          request.keyword,
          request.UserId,
          request.Id_NguoiBaoCao,
          request.Id_DoiTuong,
          request.skipCount,
          request.maxResultCount
        )
        .pipe(
          finalize(() => {
            finishedCallback();
          })
        )
        .subscribe((result) => {
          this.data = result.items;
          this.showPaging(result, pageNumber);
        });
  }

  getUserBC() {
    this.ddlNguoibaoCaoSelect = 0;
    this._notifyService.getUserBC().subscribe((rs) => {
      this.ddlNguoibaoCao = rs;
    });
  }
  getDoiTuongByUserBC(id_user) {
    this.ddlDoiTuongSelected = 0;
    this._notifyService.getDoiTuongByUserBC(id_user).subscribe((rs) => {
      this.ddlDoiTuong = rs;
    });
  }

  async ChangeSelectUserBC(id_user): Promise<boolean> {
    if (this.ddlNguoibaoCaoSelect != 0) {
      await this.getDoiTuongByUserBC(id_user);
      return true;
    } else if (this.ddlNguoibaoCaoSelect == 0) {
      this.ddlDoiTuong = [];
      this.ddlDoiTuongSelected = 0;
      return true;
    } else {
      return false;
    }
  }
  Loc() {
    // this._notifyService.search(this.appSession.user.id,this.ddlNguoibaoCaoSelect,this.ddlDoiTuongSelected).subscribe(rs=>{
    //   this.data =rs;
    // })
    //this.showPaging(result, pageNumber);
  }
}
