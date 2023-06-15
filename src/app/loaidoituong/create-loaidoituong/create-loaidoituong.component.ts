import { LoaiDoiTuongInputDto, LoaiDoiTuongServiceServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-loaidoituong',
  templateUrl: './create-loaidoituong.component.html',
  styleUrls: ['./create-loaidoituong.component.css']
})
export class CreateLoaidoituongComponent extends AppComponentBase implements OnInit {

  @Output() onSave = new EventEmitter<any>();
  saving = false;
  id: number;
  loaidt: LoaiDoiTuongInputDto= new LoaiDoiTuongInputDto();
  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    public _loaidoituongService : LoaiDoiTuongServiceServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.id != undefined) {
      this._loaidoituongService.getById(this.id).subscribe((rs) => {
        this.loaidt = rs;
      });
    }
  }
  save() {
    this.saving = true;
    if (this.id == 0 || this.id == undefined) {
      this._loaidoituongService.insert(this.loaidt).subscribe(
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
      this._loaidoituongService.update(this.loaidt).subscribe(
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
