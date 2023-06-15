
import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { PAKNDto, PAKNServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import LayerGroup from 'ol/layer/Group';
import XYZ from 'ol/source/XYZ';
import LayerSwitcher from 'ol-layerswitcher';

@Component({
  selector: 'app-pakns',
  templateUrl: './pakns.component.html',
  styleUrls: ['./pakns.component.css']
})
export class PaknsComponent extends PagedListingComponentBase<PAKNDto> implements OnInit  {
  IsHiddenGuiBaoCao:any;
  map: Map;
  pakns: PAKNDto[] = [];
  keyword= '';
  IsHiddenSuaXoa:any;

  constructor(
    private _modalService: BsModalService,
    private _service: PAKNServiceProxy,
    injector: Injector,
  ) {
    super(injector);
  }

  // ngOnInit(): void {


  //   //this.getDataPage(1);
  // }
  // GetList() {
  //   this._service.getAll(this.search).subscribe(rs => {
  //     this.pakns = rs;
  //   })
  // }
  protected list(request: any, pageNumber: number, finishedCallback: Function): void {
    request.keyword = this.keyword;
    this._service.getAll(
        request.keyword,
        request.skipCount,
        request.maxResultCount,this.appSession.userId
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result) => {
        // console.log(result.items);
        this.pakns = result.items;
        this.showPaging(result, pageNumber);
      });

  }
  private showCreateOrEditUserDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
    //   CreatePaknComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {

      createOrEditUserDialog = this._modalService.show(
      //  CreatePaknComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.getDataPage(1);
    });
  }
  create(){
    this.showCreateOrEditUserDialog();
  }
  edit(pakn: PAKNDto):void{
    this.showCreateOrEditUserDialog(pakn.id);
    // console.log(pakn.id);
  }
  protected delete(pakn: PAKNDto): void {
    abp.message.confirm(
      "Báo cáo sẽ bị xóa.",'Có chắc chắn xóa báo cáo?',
      (result: boolean) => {
        if (result) {
          this._service.delete(pakn.id).subscribe(() => {
            abp.notify.success(this.l('Xóa thành công'));
           this.getDataPage(1);
          });
        }
      }
    );
  //   abp.message.confirm(
  //     'Báo cáo sẽ bị xóa.',
  //     'Có chắc chắn xóa báo cáo?',
  //     function (isConfirmed) {
  //         if (isConfirmed) {
  //           this._service.delete(pakn.id).subscribe(() => {
  //               abp.notify.success(this.l('Xóa thành công'));
  //               this.getDataPage(1);
  //             });
  //         }
  //     }
  // );
  }

  protected guibaocao(pakn: PAKNDto): void {

    abp.message.confirm(
      this.l('Bạn có gửi báo cáo', pakn.title),
      undefined,
      (result: boolean) => {
        if (result) {
          this._service.guiBaoCao(pakn).subscribe(() => {
            abp.notify.success(this.l('Gửi báo cáo thành công'));
           this.getDataPage(1);
          });
        }
      }
    );
  }

  HidenGuiBaoCao(pakn:PAKNDto){
    if(pakn.state==1 || pakn.state==5 || pakn.state==3)
    {
      this.IsHiddenGuiBaoCao=false;

    }
    else this.IsHiddenGuiBaoCao=true;

    return this.IsHiddenGuiBaoCao;
  }

  HidenSuaXoa(pakn:PAKNDto){
    // if(pakn.state==0)
    // {
    //   this.IsHiddenSuaXoa=true;
    //   alert("vao day");
    // }
    // if(pakn.state==4)
    // {
    //   this.IsHiddenSuaXoa=true;
    // }
    // else this.IsHiddenSuaXoa=false;
    // return this.IsHiddenSuaXoa;

    if(pakn.state==0)
    {
      return true;
    }
    if(pakn.state==4)
    {
      return true;
    }
    return false;
  }
}

