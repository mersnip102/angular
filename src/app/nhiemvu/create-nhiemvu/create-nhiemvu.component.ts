import { NhiemVuInputDto, NhiemVuServiceServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-nhiemvu',
  templateUrl: './create-nhiemvu.component.html',
  styleUrls: ['./create-nhiemvu.component.css']
})
export class CreateNhiemvuComponent extends AppComponentBase implements OnInit {
  @Output() onSave = new EventEmitter<any>();
  saving = false;
  id: number;
  nhiemvu: NhiemVuInputDto= new NhiemVuInputDto();
  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    public _nhiemvuService : NhiemVuServiceServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.id != undefined) {
      this._nhiemvuService.getById(this.id).subscribe((rs) => {
        this.nhiemvu = rs;
      });
    }
  }
  save() {
    this.saving = true;
    if (this.id == 0 || this.id == undefined) {
      this._nhiemvuService.insert(this.nhiemvu).subscribe(
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
      this._nhiemvuService.update(this.nhiemvu).subscribe(
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
