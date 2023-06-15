import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import {
  SuKienInputDto,
  SuKienServiceServiceProxy,
  OrganizationUnitServiceServiceProxy,
  UserServiceProxy,
} from "@shared/service-proxies/service-proxies";
import * as moment from "moment";
import { Select2OptionData } from "ng-select2";
import { BsModalRef } from "ngx-bootstrap/modal";
import { stringify } from "querystring";
import { Options } from "select2";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { NotifyCommonService } from "services/notify-common.service";
import NotifyCommon from "@shared/models/notifycommon";
@Component({
  selector: "app-create-sukien",
  templateUrl: "./create-sukien.component.html",
  //styleUrls: ['./create-nhacviec.component.css']
})
export class CreateSuKienComponent extends AppComponentBase implements OnInit {
  saving = false;

  sukien: SuKienInputDto = new SuKienInputDto();
  @Output() onSave = new EventEmitter<any>();
  id: number;

  constructor(
    public bsModalRef: BsModalRef,
    injector: Injector,
    public _sukienService: SuKienServiceServiceProxy
  ) {
    super(injector);
  }
  ngOnInit(): void {
    if (this.id != undefined) {
      this._sukienService.getById(this.id).subscribe((rs) => {
        this.sukien = rs;
      });
    }
  }
  save() {
    this.saving = true;
    if (this.id == 0 || this.id == undefined) {
      this._sukienService.insert(this.sukien).subscribe(
        () => {
          this.notify.info(this.l("SavedSuccessfully"));
          this.bsModalRef.hide();
          this.onSave.emit();
        },
        () => {
          this.saving = false;
        }
      );
    } else {
      this._sukienService.update(this.sukien).subscribe(
        () => {
          this.notify.info(this.l("SavedSuccessfully"));
          this.bsModalRef.hide();
          this.onSave.emit();
        },
        () => {
          this.saving = false;
        }
      );
    }
  }
}
