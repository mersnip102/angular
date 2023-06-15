import { AppInitService } from './../../services/app-init.service';
import { Component, ChangeDetectionStrategy, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { Session } from 'inspector';
import { environment } from 'environments/environment';
@Component({
  selector: 'header-user-menu',
  templateUrl: './header-user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserMenuComponent extends AppComponentBase {
  fileImageUrl:string;
  avatar:string;
  constructor(private _authService: AppAuthService,injector: Injector,private config: AppInitService) {
    super(injector);

      this.fileImageUrl=environment.baseUrlMedia;// this.config.baseUrl.imgUrl

    this.avatar=this.appSession.user.avatar !=null?this.fileImageUrl +this.appSession.user.avatar:"assets/img/user.png";
  }

  logout(): void {
    this._authService.logout();
  }
}
