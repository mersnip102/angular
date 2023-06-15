import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { ChucDanhServiceServiceProxy, ChucDanhInputDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateChucDanhComponent} from './create-chucdanh/create-chucdanh.component';

@Component({
  selector: 'app-chucdanh',
  templateUrl: './chucdanh.component.html',
  styleUrls: ['./chucdanh.component.css']
})
export class ChucDanhComponent extends PagedListingComponentBase<ChucDanhInputDto> implements OnInit {

  chucdanhs: ChucDanhInputDto[] = [];
  search: string;
  keyword = '';
  constructor(
    private _modalService: BsModalService,
    private _chucdanhService:ChucDanhServiceServiceProxy,
    injector: Injector,
  ) { super(injector)}


  create(){
    this.showCreateOrEditUserDialog(0);
  }
  edit(chucdanh: ChucDanhInputDto):void{
    this.showCreateOrEditUserDialog(chucdanh.id);
    console.log(chucdanh);
  }
  protected list(
    request: any,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    this._chucdanhService.getChucDanhAll(
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
        this.chucdanhs = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  private showCreateOrEditUserDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;

    if (id==0) {
      createOrEditUserDialog = this._modalService.show(
        CreateChucDanhComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {

      createOrEditUserDialog = this._modalService.show(
        CreateChucDanhComponent,
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
  protected delete(chucdanhdto: ChucDanhInputDto): void {
    abp.message.confirm(
      this.l('Bạn có muốn xóa', chucdanhdto.tenChucDanh),
      "Bạn chắc chắn xóa bản ghi ?",
      (result: boolean) => {
        if (result) {
          this._chucdanhService.delete(chucdanhdto.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }
}
