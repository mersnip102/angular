import { forEach } from 'lodash-es';
import { CreateUserDVHCDto, DVHC_UserViewDto, UserDVHCServiceServiceProxy, UserDVHCViewDto, UserViewDto } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';

class PagedUserDVHCResultRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  selector: 'app-userdvhc',
  templateUrl: './userdvhc.component.html',
  styleUrls: ['./userdvhc.component.css']
})
export class UserdvhcComponent extends PagedListingComponentBase<UserDVHCViewDto> {
  protected delete(entity: UserDVHCViewDto): void {
    throw new Error('Method not implemented.');
  }

  SelectedTinh:number;
  SelectedHuyen:number;
  SelectedXa:number;
  orgsTinh: any;
  orgsHuyen: any;
  orgsXa: any;
  users :UserDVHCViewDto[] = [];
  users_dvhc :DVHC_UserViewDto[] = [];
  user_dvhc = new CreateUserDVHCDto();
  keyword = '';
  keywords = '';
  User_Check:any;
  isOrgSelect= false;
  CheckUser = false;
  listUserId:number[]=[];
  p: number = 1;
  constructor(injector: Injector,private _userdvhcService: UserDVHCServiceServiceProxy)
  {
    super(injector);
  }

  ngOnInit(): void {
    this.getAllTinh();
    this.getDataPage(1);
    this.getlistUserDVHC();
  }

  protected list(
    request: PagedUserDVHCResultRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._userdvhcService
      .get_UserView(
        request.keyword,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result) => {
        this.users = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  getAllTinh()
  {
    this.SelectedTinh = 0;
    this.SelectedHuyen = 0;
    this.SelectedXa = 0;
    this._userdvhcService.getAllTinh().subscribe(rs => {
      this.orgsTinh = rs;
    })
  }
  getHuyenByTinh(ma_tinh) {
    this.SelectedHuyen = 0;
    this._userdvhcService.getAllHuyen(ma_tinh).subscribe(rs => {
      this.orgsHuyen = rs;
    })
  }
  getXaByHuyen(ma_huyen) {
    this.SelectedXa = 0;
    this._userdvhcService.getAllXa(ma_huyen).subscribe(rs => {
      this.orgsXa = rs;
    })
  }
  ChangeHuyen(ma_huyen)
  {
    this.getXaByHuyen(ma_huyen);
  }
  ChangeTinh(ma_tinh){
    let matinh=parseInt(ma_tinh)||0;
    if(matinh>0)
    {
      this.getHuyenByTinh(ma_tinh);
    }
    else
      this.orgsHuyen=null;
  }
  save(){
    this.listUserId=[];
    this.users.forEach(item=>{
      if(item.isChecked)
      {
        this.listUserId.push(item.id);
      }
    });

    if(this.SelectedTinh == 0)
    {
      this.isOrgSelect =true;
      return;
    }
    else if(this.listUserId.length==0)
    {
      this.CheckUser =true;
      return;
    }
    else
    {
      this.isOrgSelect =false;
      this.CheckUser =false;
      this.user_dvhc.listUserId = this.listUserId;
      if(this.SelectedTinh>0)
      {
        this.user_dvhc.ma_dvhc_t = this.SelectedTinh.toString();
        this.user_dvhc.ma_dvhc_h = this.SelectedHuyen.toString();
        this.user_dvhc.ma_dvhc_x = this.SelectedXa.toString();
      }
      else
      {
        this.user_dvhc.ma_dvhc_t = "-1";
        this.user_dvhc.ma_dvhc_h = "-1";
        this.user_dvhc.ma_dvhc_x = "-1";
        this.user_dvhc.id_DVHC = "-1";
        this.user_dvhc.dvhC_MaHuyen = "-1";
        this.user_dvhc.dvhC_MaTinh = "-1";
      }
      this._userdvhcService.insert_UserDVHC(this.user_dvhc).subscribe(
        () => {
          this.notify.info(this.l('SavedSuccessfully'));
          this.users.forEach(item=>{
            item.isChecked=false;
          });
          this.SelectedTinh=0;
          this.SelectedHuyen=0;
          this.SelectedXa=0;
          this.getlistUserDVHC();
        },
      );
    }

  }

  clearFilters(): void {
    this.keyword = '';
    this.keywords = '';
    this.getDataPage(1);
  }



  getlistUserDVHC()
  {
    this._userdvhcService
      .get_UserDVHCView(this.keywords).subscribe(rs=>{
        this.users_dvhc = rs;
      })

  }

  protected xoa(user): void {
    abp.message.confirm(
      "Bản ghi sẽ bị xóa.",'Có chắc chắn xóa bản ghi?',
      (result: boolean) => {
        if (result) {
          this._userdvhcService.delete_UserDVHC(user.id).subscribe(() => {
            abp.notify.success(this.l('Xóa thành công'));
            this.getlistUserDVHC();
          });
        }
      }
    );
  }
}
