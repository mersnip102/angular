import {
  Component,
  ChangeDetectionStrategy,
  Injector,
  OnInit
} from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AppInitService } from 'services/app-init.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'sidebar-user-panel',
  templateUrl: './sidebar-user-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarUserPanelComponent extends AppComponentBase
  implements OnInit {
  shownLoginName = '';
  shownfullName = '';
  fileImageUrl:string;
  avatar:string;
  constructor(injector: Injector,private config: AppInitService) {
    super(injector);


  }

  ngOnInit() {
    // this.shownLoginName = this.appSession.getShownLoginName();
    this.shownfullName = this.appSession.getShownFullName();
    this.fileImageUrl=environment.baseUrlMedia;// this.config.baseUrl.imgUrl
    this.avatar=this.appSession.user.avatar !=null?this.fileImageUrl +this.appSession.user.avatar:"assets/img/user.png";
  }
}
