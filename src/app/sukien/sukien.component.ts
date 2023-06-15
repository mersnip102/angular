import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { SuKienServiceServiceProxy, SuKienInputDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateSuKienComponent} from './create-sukien/create-sukien.component';
@Component({
  selector: 'app-sukien',
  templateUrl: './sukien.component.html',
  styleUrls: ['./sukien.component.css']
})
export class SuKienComponent extends PagedListingComponentBase<SuKienInputDto> implements OnInit {

  sukiens: SuKienInputDto[] = [];
  search: string;
  keyword = '';
  constructor(
    private _modalService: BsModalService,
    private _sukienService:SuKienServiceServiceProxy,
    injector: Injector,
  ) { super(injector)}


  create(){
    this.showCreateOrEditUserDialog(0);
  }
  edit(sukien: SuKienInputDto):void{
    this.showCreateOrEditUserDialog(sukien.id);

  }
  protected list(
    request: any,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    this._sukienService.getSuKienAll(
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
        this.sukiens = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  private showCreateOrEditUserDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;

    if (id==0) {
      createOrEditUserDialog = this._modalService.show(
        CreateSuKienComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {

      createOrEditUserDialog = this._modalService.show(
        CreateSuKienComponent,
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
  protected delete(sukiendto: SuKienInputDto): void {
    abp.message.confirm(
      this.l('Bạn có muốn xóa', sukiendto.tenSuKien),
      "Bạn chắc chắn xóa bản ghi ?",
      (result: boolean) => {
        if (result) {
          this._sukienService.delete(sukiendto.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }
}