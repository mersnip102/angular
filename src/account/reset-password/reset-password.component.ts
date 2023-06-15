import { Component, EventEmitter, Injector, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponentBase } from "@shared/app-component-base";
import { AbpValidationError } from "@shared/components/validation/abp-validation.api";
import { AccountServiceProxy, ChangePasswordAccDto } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent extends AppComponentBase implements OnInit {
  saving = false;
  newPassword: string;
  key: string;
  ChangePasswordAccDto = new ChangePasswordAccDto();
  @Output() onSave = new EventEmitter<any>();
  newPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: "pattern",
      localizationKey:
        "PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber",
    },
  ];
  confirmNewPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: "validateEqual",
      localizationKey: "PasswordsDoNotMatch",
    },
  ];
  constructor(private route: ActivatedRoute,private _accountService:AccountServiceProxy,injector: Injector,private _router: Router,) {
    super(injector);
  }

  ngOnInit() {

  }
  changePassword() {
    this.saving = true;
    this.route.queryParams.subscribe((params) => {
      this.key = params.key;
    });
    this.ChangePasswordAccDto.key=this.key;
    this._accountService.changePassword(this.ChangePasswordAccDto).pipe(
      finalize(() => {
        this.saving = false;
      })
    )
    .subscribe((success) => {
      if (success) {
        abp.message.success('Mật khẩu thay đổi thành công!', 'Success');
        this._router.navigate(['/account/login']);
      }
    });
  }
}
