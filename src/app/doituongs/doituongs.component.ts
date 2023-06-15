
import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DoiTuongDto, DoiTuongServiceProxy } from '@shared/service-proxies/service-proxies';
//import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateDoituongComponent } from './create-doituong/create-doituong.component';
 import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PagedListingComponentBase } from '@shared/paged-listing-component-base';

@Component({
  selector: 'app-doituongs',
  templateUrl: './doituongs.component.html',
  styleUrls: ['./doituongs.component.css']
})
export class DoituongsComponent extends PagedListingComponentBase<DoiTuongDto> implements OnInit {
  doituongs: DoiTuongDto[] = [];
  keyword = '';
  Dday = new Date;
  constructor(
    private _modalService: BsModalService,
    private _doituongService:DoiTuongServiceProxy,
    injector: Injector,
  ) {
    super(injector);
  }
  // ngOnInit(): void {
  //   //this.Getlist();
  // }

  protected list(
    request: any,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    this._doituongService.getAllDoiTuong(
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
        this.doituongs = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  create(){
    this.showCreateOrEditUserDialog();
  }
  edit(doituong: DoiTuongDto): void {
    this.showCreateOrEditUserDialog(doituong.id);
  }
  protected delete(doituongdto: DoiTuongDto): void {
    abp.message.confirm(
      this.l('Bạn có muốn xóa đối tượng {0}', doituongdto.name),
      "Bạn có chắc chắn muốn xóa?",
      (result: boolean) => {
        if (result) {
          this._doituongService.delete(doituongdto.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
          this.refresh();
          });
        }
      }
    );
  }

  private showCreateOrEditUserDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
        CreateDoituongComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditUserDialog = this._modalService.show(
        CreateDoituongComponent,
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
}
