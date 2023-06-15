import { CreateModalConfigComponent } from './create-modal-config/create-modal-config.component';
import { forEach } from 'lodash-es';
import { Config } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ConfigInputDto, ConfigServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-configs',
  templateUrl: './configs.component.html',
  styleUrls: ['./configs.component.css']
})
export class ConfigsComponent extends AppComponentBase implements OnInit {

  configs:Config[]=[];
  constructor( injector: Injector,
    private _configService:ConfigServiceServiceProxy,
    private _modalService: BsModalService,
    ) {
      super(injector);
    }
  ngOnInit(): void {
   this.getConfigs();
  }
  getConfigs():void
  {
    this._configService.getConfigs().subscribe(result=>{
      this.configs=result;
    })
  }
  saveConfigs()
  {
    this.configs.forEach(item=>{
      var configDto =new ConfigInputDto();
      configDto=item;
        this._configService.updateConfig(configDto).subscribe(rs=>{
        });
        this.notify.info(this.l('SavedSuccessfully'));
    })
  }
  public showCreateOrEditDialog(): void {
    let createOrEditDialog: BsModalRef;
    createOrEditDialog = this._modalService.show(
        CreateModalConfigComponent,
        {
          class: 'modal-lg',
        }
      );

      createOrEditDialog.content.onSave.subscribe(() => {
      this.getConfigs();
    });
  }
  deleteConfig(id:number)
  {
    abp.message.confirm(
     "Bạn có chắc chắn muốn xóa bản ghi này?",
      undefined,
      (result: boolean) => {
        if (result) {
          this._configService.deleteConfig(id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.getConfigs();
          });
        }
      }
    );
  }

}
