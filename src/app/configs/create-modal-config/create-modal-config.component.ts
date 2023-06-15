import { ConfigInputDto, ConfigServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-modal-config',
  templateUrl: './create-modal-config.component.html',
  styleUrls: ['./create-modal-config.component.css']
})
export class CreateModalConfigComponent extends AppComponentBase implements OnInit {
  saving = false;
  configs:ConfigInputDto=new ConfigInputDto();
  @Output() onSave = new EventEmitter<any>();
  constructor(
    public bsModalRef: BsModalRef,
    private _configService:ConfigServiceServiceProxy,
    injector: Injector,

  ) {
    super(injector);
   }

  ngOnInit(): void {
  }
  save(){
    this.saving = true;
      this._configService.saveConfig(this.configs).subscribe(result=>{
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      err=>{
        console.log(err.message)
      }

      );
  }

}
