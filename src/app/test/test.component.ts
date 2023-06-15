import { Options } from 'select2';
import { ModalMapComponent } from "./modal-map/modal-map.component";
import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output, ViewChild } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import NotifyCommon from "shared/models/notifycommon";
import { NotifyCommonService } from "services/notify-common.service";
import { AppComponentBase } from "@shared/app-component-base";
import { map } from "rxjs/operators";
import {
  NhacviecDto,
  NhacViecServiceServiceProxy,
  OrganizationUnitServiceServiceProxy,
  ThongBaoNhacViecDto,
  ThongBaoNhacViecServiceServiceProxy,
} from "@shared/service-proxies/service-proxies";
import {
  resultList,
  RxSpeechRecognitionService,
} from "@kamiazya/ngx-speech-recognition";
import {
  NgbDatepicker,
  NgbDatepickerModule,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { NgbDate, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Select2OptionData } from "ng-select2";


@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.css"],
})
export class TestComponent extends AppComponentBase implements OnInit {
  org: any;
  orgSelected: any;
  userSelected: any;
  saving = false;
  numberValue: any[] = [];
  nhacviec: NhacviecDto = new NhacviecDto();
  @Output() onSave = new EventEmitter<any>();
  id: number;
  public users: Array<Select2OptionData>;
  public tochucs: Array<Select2OptionData>;
  public options: Options;
  value: string[] = [];
  valueTemp: string[] = [];
  userToChuc: number[] = [];
  userNhom: number[] = [];
  valueNumber: number[] = [];
  _notify: NotifyCommon[] = [];
  lstnhomnguoidung: any;
  SelectedNhomNguoiDung: number;
  CheckUser = false;
  //ckeditor

  items: any[] = [];
  item_tochucs: any[] = [];
  constructor(
    public _nhacviecService: NhacViecServiceServiceProxy,
    private organizationService: OrganizationUnitServiceServiceProxy,
    injector: Injector,
    private changeDetector: ChangeDetectorRef,
  ) {
    super(injector);
    this.options = {
      multiple: true,
      tags: true,
    };
  }

  async ngOnInit(): Promise<void> {
    await this.getOrganization();
  this.id=283;
  this.SelectedNhomNguoiDung=0;
    if (this.id != undefined) {
      await this._nhacviecService.getById(this.id).subscribe(async (rs) => {
        this.nhacviec = rs;
        this.orgSelected = rs.userOrg;
        this.SelectedNhomNguoiDung = rs.roleId;
        let user: string[] = [];
        rs.userIds.forEach((r) => {
          user.push(r.toString());
        });
        console.log("nhảy vào đây")
        this.userSelected = user; // this.userToChuc;
        console.log(this.userSelected);
      });
    }
  }
  async getOrganization() {
    this.orgSelected = 0;
    //Lấy dữ liệu cây tổ chức
    await this.organizationService
      .getOrganizationUnitsViewDropdown(0)
      .subscribe((rs) => {
        rs.forEach((el) => {
          this.item_tochucs.push({
            id: el.id.toString(),
            text: el.displayName,
          });
        });
        this.tochucs = [...this.item_tochucs];
      });
  }

  async getUserByToChuc() {
     this.items=[];
      let nv =await this._nhacviecService.getUsersByToChucID(this.orgSelected, 0).toPromise();
      nv.forEach(r=>{
        this.items.push({ id: r.id.toString(), text: r.userName });
      });
      this.users = [...this.items];
  }
  Changetochuc() {
    this.userSelected=[];
    this.getUserByToChuc();
  }
  // ngAfterContentChecked(): void {
  //   this.changeDetector.detectChanges();

  //   console.log("11111111111");
  //   console.log(this.userSelected);
  // }
}
