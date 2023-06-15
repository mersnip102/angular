import { CreateLoaidoituongComponent } from './create-loaidoituong/create-loaidoituong.component';
import { LoaiDoiTuongInputDto, LoaiDoiTuongServiceServiceProxy } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-loaidoituong',
  templateUrl: './loaidoituong.component.html',
  styleUrls: ['./loaidoituong.component.css']
})
export class LoaidoituongComponent extends PagedListingComponentBase<LoaiDoiTuongInputDto> {

  loaidts: LoaiDoiTuongInputDto[] = [];
  search: string;
  keyword = '';
  constructor(
    private _modalService: BsModalService,
    private _loaidoituongService:LoaiDoiTuongServiceServiceProxy,
    injector: Injector,
  ) { super(injector)}
  create(){
    this.showCreateOrEditUserDialog(0);
  }
  edit(nhiemvu: LoaiDoiTuongInputDto):void{
    this.showCreateOrEditUserDialog(nhiemvu.id);

  }
  protected list(
    request: any,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    this._loaidoituongService.getLoaiDoiTuongAll(
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
        this.loaidts = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  private showCreateOrEditUserDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;

    if (id==0) {
      createOrEditUserDialog = this._modalService.show(
        CreateLoaidoituongComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {

      createOrEditUserDialog = this._modalService.show(
        CreateLoaidoituongComponent,
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
  protected delete(loaidtDto: LoaiDoiTuongInputDto): void {
    abp.message.confirm(
      this.l('Bạn có muốn xóa', loaidtDto.tenLoaiDoiTuong),
      "Bạn chắc chắn xóa bản ghi ?",
      (result: boolean) => {
        if (result) {
          this._loaidoituongService.delete(loaidtDto.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }
}
