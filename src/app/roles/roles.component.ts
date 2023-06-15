import { Component, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
  RoleServiceProxy,
  RoleDto,
  RoleDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { CreateRoleDialogComponent } from './create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './edit-role/edit-role-dialog.component';
import { result } from 'lodash';
import { RSA_SSLV23_PADDING } from 'constants';

class PagedRolesRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  templateUrl: './roles.component.html',
  animations: [appModuleAnimation()]
})
export class RolesComponent extends PagedListingComponentBase<RoleDto> {
  roles: RoleDto[] = [];
  keyword = '';
  permissionName:any[]=[];
  lstKey:string[]=[];
  constructor(
    injector: Injector,
    private _rolesService: RoleServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }



  list(
    request: PagedRolesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._rolesService
      .getAll(request.keyword, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: RoleDtoPagedResultDto) => {

        this.roles = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  PermistionDisplayName(grantedPermissions:[]):string[]
  {
      let arrDisplay=[];
      grantedPermissions.forEach(x=>{
        arrDisplay.push(this.l(x));
      })
      return arrDisplay.sort();
  }



  // delete(role: RoleDto): void {
  //   abp.message.confirm(
  //     this.l('Quyền {0} sẽ bị xóa và hủy liên kết với các người dùng đã gán.', role.name),
  //     "Bạn có chắc chắn muốn xóa",
  //     (result: boolean) => {
  //       if (result) {
  //         // if(role.name == "Nhóm phê duyệt báo cáo" || role.name == "Nhóm xem báo cáo"
  //         // || role.name == "Nhóm quản trị" || role.name == "Nhóm báo cáo")
  //         // {
  //         //   abp.notify.error(this.l('Không được phép xóa nhóm'));
  //         //   return;
  //         // }
  //         this._rolesService
  //           .delete(role.id)
  //           .pipe(
  //             finalize(() => {
  //               abp.notify.success(this.l('SuccessfullyDeleted'));
  //               this.refresh();
  //             })
  //           )
  //           .subscribe(() => {});
  //       }
  //     }
  //   );
  // }

  protected delete(role: RoleDto): void {
    abp.message.confirm(
      this.l('Bạn có muốn xóa', role.name),
      "Bạn chắc chắn xóa bản ghi ?",
      (result: boolean) => {
        if (result) {
          this._rolesService.delete(role.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  createRole(): void {
    this.showCreateOrEditRoleDialog();
  }

  editRole(role: RoleDto): void {
    this.showCreateOrEditRoleDialog(role.id);
  }

  showCreateOrEditRoleDialog(id?: number): void {
    let createOrEditRoleDialog: BsModalRef;
    if (!id) {
      createOrEditRoleDialog = this._modalService.show(
        CreateRoleDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditRoleDialog = this._modalService.show(
        EditRoleDialogComponent,
        {
          class: 'modal-xl',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditRoleDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
}
