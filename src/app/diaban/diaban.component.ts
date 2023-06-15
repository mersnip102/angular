import { CreatDiabanComponent } from './creat-diaban/creat-diaban.component';
import { DiaBan, DiaBanServiceServiceProxy, Xa, Tinh, Huyen } from '@shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-diaban',
  templateUrl: './diaban.component.html',
  styleUrls: ['./diaban.component.css']
})
export class DiabanComponent extends PagedListingComponentBase<DiaBan>{

  diabans: DiaBan[] = [];
  search: string;
  keyword = '';
  constructor(
    private _modalService: BsModalService,
    private _diabanService:DiaBanServiceServiceProxy,
    injector: Injector,
  ) { super(injector)}
  create(){
    this.showCreateOrEditUserDialog(0);
  }
  edit(diaban: DiaBan):void{
    this.showCreateOrEditUserDialog(diaban.id);

  }
  protected list(
    request: any,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    this._diabanService.getDiaBanAll(
        request.Tinh,
        request.Huyen,
        request.Xa,
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
        this.diabans = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  private showCreateOrEditUserDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;

    if (id==0) {
      createOrEditUserDialog = this._modalService.show(
        CreatDiabanComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {

      createOrEditUserDialog = this._modalService.show(
        CreatDiabanComponent,
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
  protected delete(diabandto: DiaBan): void {
    abp.message.confirm(
      this.l('Bạn có muốn xóa', diabandto.tenDiaBan),
      "Bạn chắc chắn xóa bản ghi ?",
      (result: boolean) => {
        if (result) {
          this._diabanService.delete(diabandto.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }
}
