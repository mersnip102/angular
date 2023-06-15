import { NotifyServiceServiceProxy } from './../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NotifyDto, UserDto } from '@shared/service-proxies/service-proxies';
@Component({
  selector: 'headernotify',
  templateUrl: './headernotify.component.html',

})
export class HeadernotifyComponent extends AppComponentBase implements OnInit {
  id :number;
  notifys: NotifyDto=new NotifyDto();
  user = new UserDto();
  show = false;
  autohide = true;
  constructor(
    injector: Injector,
    public _notify: NotifyServiceServiceProxy,
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.id = this.appSession.user.id;
    this.getNotify();
  }
  getNotify()
  {
    this._notify.thongBaoDinhKy(this.id).subscribe(rs=>{
      this.notifys = rs;
      //console.log(this.notifys)
    })
  }
  IsReadedNotify()
  {
    this._notify.updateIsReaded(this.id).subscribe(rs=>{
      this.notifys.isCountReaded=0;
    })
  }
}
