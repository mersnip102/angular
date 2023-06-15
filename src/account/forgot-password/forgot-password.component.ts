import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { AccountServiceProxy, MailRequest } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent extends AppComponentBase implements OnInit  {
saving:boolean=false;
model:MailRequest =new MailRequest()
  constructor(
    injector: Injector,
    private _router: Router,
    private _emailService:AccountServiceProxy
  ) {  super(injector);}

  ngOnInit() {
  }
  save(){
    this._emailService.sendEmail(this.model).subscribe(rs=>{
      this.notify.success("Thông tin đã được gửi tới email. Truy cập email để lấy lại mật khẩu.");
      this._router.navigate(['/account/login']);
    },
        error => {
            console.log(error);
        }
    );
  }
}
