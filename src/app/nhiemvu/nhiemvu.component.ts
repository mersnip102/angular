import { NhacViecServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { NhiemVuInputDto, NhiemVuServiceServiceProxy } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateNhiemvuComponent } from './create-nhiemvu/create-nhiemvu.component';
import { PagedListingComponentBase } from '@shared/paged-listing-component-base';

@Component({
  selector: 'app-nhiemvu',
  templateUrl: './nhiemvu.component.html',
  styleUrls: ['./nhiemvu.component.css']
})
export class NhiemvuComponent extends PagedListingComponentBase<NhiemVuInputDto>{

  nhiemvus: NhiemVuInputDto[] = [];
  search: string;
  keyword = '';
  constructor(
    private _modalService: BsModalService,
    private _nhiemvuService:NhiemVuServiceServiceProxy,
    injector: Injector,
  ) { super(injector)}
  create(){
    this.showCreateOrEditUserDialog(0);
  }
  edit(nhiemvu: NhiemVuInputDto):void{
    this.showCreateOrEditUserDialog(nhiemvu.id);

  }
  protected list(
    request: any,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    this._nhiemvuService.getNhiemVuAll(
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
        this.nhiemvus = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  private showCreateOrEditUserDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;

    if (id==0) {
      createOrEditUserDialog = this._modalService.show(
        CreateNhiemvuComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {

      createOrEditUserDialog = this._modalService.show(
        CreateNhiemvuComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditUserDialog.content.onSave.subscribe(() => {
    this.refresh();
    });
  }
  protected delete(nhiemvudto: NhiemVuInputDto): void {
    abp.message.confirm(
      this.l('Bạn có muốn xóa', nhiemvudto.tenNhiemVu),
      "Bạn chắc chắn xóa bản ghi ?",
      (result: boolean) => {
        if (result) {
          this._nhiemvuService.delete(nhiemvudto.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }
}
