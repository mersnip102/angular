import { createComponent } from '@angular/compiler/src/core';
import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { PAKNDto, PAKNServiceProxy, CQueryableServiceServiceProxy, DTODuyetPAKN } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-duyet-baocao',
  templateUrl: './duyet-baocao.component.html',
  styleUrls: ['./duyet-baocao.component.css']
})
export class DuyetBaocaoComponent extends PagedListingComponentBase<PAKNDto> implements OnInit {

  
  pakns: DTODuyetPAKN[] = [];
  IsHidden:any;

  keyword= '';
  constructor(
    private _modalService: BsModalService,
    private _service: PAKNServiceProxy,
    private cQueryableService: CQueryableServiceServiceProxy,
    injector: Injector,
  ) {
    super(injector);

  }

  protected list(request: any, pageNumber: number, finishedCallback: Function): void {
    request.keyword = this.keyword;
    this.cQueryableService.getAllDuyetBaoCao(
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
        this.pakns = result.items;
        this.showPaging(result, pageNumber);
      });

  }

  protected delete(pakn: PAKNDto): void {
    abp.message.confirm(
      this.l('Bạn có muốn xóa', pakn.title),
      undefined,
      (result: boolean) => {
        if (result) {
          this._service.delete(pakn.id).subscribe(() => {
            abp.notify.success(this.l('Xóa thành công'));
           this.getDataPage(1);
          });
        }
      }
    );
  }

 

  HidenDuyet(pakn:PAKNDto){
    if(pakn.state==5 || pakn.state==3)
    {
      this.IsHidden=false;

    }
    else this.IsHidden=true;

    return this.IsHidden;
  }

}
