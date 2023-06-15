import { AuditLogServiceServiceProxy, AuditLogViewDto } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.css']
})
export class AuditLogComponent extends PagedListingComponentBase<AuditLogViewDto> implements OnInit {


  logs: any;
  userName:string;
  keyword = '';
  constructor(
    private _auditLogService:AuditLogServiceServiceProxy,
    injector: Injector,
  ) {
    super(injector);
  }
  protected list(request: any, pageNumber: number,
    finishedCallback: Function): void {
    request.keyword = this.keyword;
    this._auditLogService.getAllAuditLog(
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
        this.logs = result.items;
        // console.log(this.logs)
        this.showPaging(result, pageNumber);
      });
  }
  protected delete(entity: AuditLogViewDto): void {
    throw new Error('Method not implemented.');
  }
}
