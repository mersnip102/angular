import { Component, ChangeDetectionStrategy, OnInit, Injector } from '@angular/core';
import { ThongBaoNhacViecServiceServiceProxy,  UserDto } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  ThongBaoNhacViecDto
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { HttpClientModule } from '@angular/common/http';

import { finalize } from 'rxjs/operators';
@Component({
  selector: 'headerthongbao',
  templateUrl: './headerthongbao.component.html',

})
export class HeaderThongBaoComponent extends AppComponentBase implements OnInit {
  protected delete(entity: ThongBaoNhacViecDto): void {
    throw new Error('Method not implemented.');

  }
  id :number;
  thongbao: ThongBaoNhacViecDto = new ThongBaoNhacViecDto();
  user = new UserDto();
  show = false;
  autohide = true;
  constructor(
    injector: Injector,
    public _thongbaonhacviecservice: ThongBaoNhacViecServiceServiceProxy,
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.id = this.appSession.user.id;
   this.getNotify();
  }
  getNotify()
  {
    this._thongbaonhacviecservice.getById(this.id).subscribe(rs=>{
      this.thongbao = rs;
      //console.log(rs.countIsNotReaded)
    })
  }
  IsReadedNotify()
  {
    this._thongbaonhacviecservice.updateReadedNotify(this.id).subscribe(rs=>{
      this.thongbao.countIsNotReaded=0;
    })
  }
}
