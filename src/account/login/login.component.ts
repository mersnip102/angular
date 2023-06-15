import { AccountServiceProxy } from '@shared/service-proxies/service-proxies';
import { Component, Injector } from '@angular/core';
import { AbpSessionService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppAuthService } from '@shared/auth/app-auth.service';

@Component({
  templateUrl: './login.component.html',
  animations: [accountModuleAnimation()]
})
export class LoginComponent extends AppComponentBase {
  submitting = false;

  constructor(
    injector: Injector,
    public authService: AppAuthService,
    private _sessionService: AbpSessionService,
    private accountService:AccountServiceProxy
  ) {
    super(injector);
  }

  get multiTenancySideIsTeanant(): boolean {
    return this._sessionService.tenantId > 0;
  }

  get isSelfRegistrationAllowed(): boolean {
    if (!this._sessionService.tenantId) {
      return false;
    }

    return true;
  }

  login(): void {
    let userName= this.authService.authenticateModel.userNameOrEmailAddress;
    this.accountService.isCheckDateExpried(userName).subscribe(rs=>{
      if(rs==true)
      {
        this.submitting = true;
        this.authService.authenticate(() => (this.submitting = false));
      }
      else
      {
        this.notify.warn("Tài khoản đăng nhập đã quá thời hạn !. Liên hệ với quản trị để biết thêm chi tiết.");
        return;
      }
    })

  }
}
