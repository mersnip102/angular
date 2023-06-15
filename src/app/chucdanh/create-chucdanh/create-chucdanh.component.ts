import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ChucDanhInputDto, ChucDanhServiceServiceProxy ,OrganizationUnitServiceServiceProxy, UserServiceProxy} from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { Select2OptionData } from 'ng-select2';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { stringify } from 'querystring';
import { Options } from 'select2';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NotifyCommonService } from 'services/notify-common.service';
import NotifyCommon from '@shared/models/notifycommon';
@Component({
  selector: 'app-create-chucdanh',
  templateUrl: './create-chucdanh.component.html',
  //styleUrls: ['./create-nhacviec.component.css']
})
export class CreateChucDanhComponent extends AppComponentBase implements OnInit {

    saving = false;

    chucdanh: ChucDanhInputDto= new ChucDanhInputDto();
    @Output() onSave = new EventEmitter<any>();
    id: number;  


  constructor(
    public bsModalRef: BsModalRef,
    injector: Injector,
    public _chucdanhService: ChucDanhServiceServiceProxy,
 
  ) {
    super(injector);
 
   }
   ngOnInit(): void {
    console.log(this.id)
   if(this.id != undefined)
   {
     this._chucdanhService.getById(this.id).subscribe(rs=>{
       this.chucdanh =rs;
     })
   }
  }
  save(){
    this.saving = true;
    if(this.id ==0 || this.id ==undefined){
      this._chucdanhService.insert(this.chucdanh).subscribe(
        () => {
          this.notify.info(this.l('SavedSuccessfully'));
          this.bsModalRef.hide();
          this.onSave.emit();

        },
        () => {
          this.saving = false;
        }
      );
    }
    else{
      this._chucdanhService.update(this.chucdanh).subscribe(
        () => {
          this.notify.info(this.l('SavedSuccessfully'));
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
