import { DiaBanServiceServiceProxy,DiaBan, UserDVHCServiceServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-creat-diaban',
  templateUrl: './creat-diaban.component.html',
  styleUrls: ['./creat-diaban.component.css']
})
export class CreatDiabanComponent extends AppComponentBase implements OnInit {

  @Output() onSave = new EventEmitter<any>();
  saving = false;
  id: number;
  diaban: DiaBan= new DiaBan();
  isTinhSelect :boolean = false;
  SelectedTinh:any;
  SelectedHuyen:any;
  SelectedXa:any;
  tinh:any;
  xa:any;
  huyen:any;
  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    public _diabanService : DiaBanServiceServiceProxy,
    private _userdvhcService: UserDVHCServiceServiceProxy
  ) {
    super(injector);
  }

 async ngOnInit() {
    if (this.id != undefined) {
      this._diabanService.getById(this.id).subscribe((rs) => {
        this.diaban = rs;
        this.SelectedTinh = rs.maTinh;
        this.getHuyenByTinh(rs.maTinh);
        this.SelectedHuyen = rs.maHuyen;
        this.getXaByHuyen(rs.maHuyen);
        this.SelectedXa = rs.maXa;
      });
    }
    this.getAllTinh();
  }
  save() {
    this.saving = true;
    this.diaban.maTinh = this.SelectedTinh;
    this.diaban.maHuyen = this.SelectedHuyen;
    this.diaban.maXa = this.SelectedXa;
    if (this.id == 0 || this.id == undefined) {
      if(this.SelectedTinh == '0')
      {
        this.isTinhSelect =true;
        return;
      }
      else
      {
        this._diabanService.insert(this.diaban).subscribe(
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

    } else {
      this._diabanService.update(this.diaban).subscribe(
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

  getHuyenByTinh(ma_tinh) {
    this.SelectedHuyen = "0";
    this._userdvhcService.getAllHuyen(ma_tinh).subscribe(rs => {
      this.huyen = rs;
    })
  }
  getXaByHuyen(ma_huyen) {
    this.SelectedXa = "0";
    this._userdvhcService.getAllXa(ma_huyen).subscribe(rs => {
      this.xa = rs;
    })
  }
  ChangeHuyen(ma_huyen)
  {
    this.getXaByHuyen(ma_huyen);
  }
  ChangeTinh(ma_tinh){
    this.getHuyenByTinh(ma_tinh);
  }
  ChangeXa(ma_tinh){
    this.getHuyenByTinh(ma_tinh);
  }
  getAllTinh()
  {
    this.SelectedTinh = "0";
    this.SelectedHuyen = "0";
    this.SelectedXa = "0";
    this._userdvhcService.getAllTinh().subscribe(rs => {
      this.tinh = rs;
    })
  }
}
