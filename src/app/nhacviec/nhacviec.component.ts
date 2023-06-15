import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { NhacviecDto, NhacViecServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateNhacviecComponent } from './create-nhacviec/create-nhacviec.component';

@Component({
  selector: 'app-nhacviec',
  templateUrl: './nhacviec.component.html',
  styleUrls: ['./nhacviec.component.css']
})
export class NhacviecComponent extends PagedListingComponentBase<NhacviecDto> implements OnInit {

  nhacviecs: NhacviecDto[] = [];
  search: string;
  keyword = '';
  constructor(
    private _modalService: BsModalService,
    private _nhacviecService:NhacViecServiceServiceProxy,
    injector: Injector,
  ) { super(injector)}


  create(){
    this.showCreateOrEditUserDialog();
  }
  edit(nhacviec: NhacviecDto):void{
    this.showCreateOrEditUserDialog(nhacviec.id);
    // console.log(nhacviec.id);
  }
  protected list(
    request: any,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    this._nhacviecService.getNhacViec(
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
        this.nhacviecs = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  private showCreateOrEditUserDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
        CreateNhacviecComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {

      createOrEditUserDialog = this._modalService.show(
        CreateNhacviecComponent,
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
  protected delete(nhacviecdto: NhacviecDto): void {
    abp.message.confirm(
      this.l('Bạn có muốn xóa', nhacviecdto.noiDung),
      undefined,
      (result: boolean) => {
        if (result) {
          this._nhacviecService.delete(nhacviecdto.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }
}
