import { Data } from "./../../../services/data";
import {
  CreateOrganizationUnitInput,
  OrganizationUnitServiceServiceProxy,
  OrganizationViewTreeDto,
  DiaBan,
  DiaBanServiceServiceProxy,
  UserDVHCServiceServiceProxy,
} from "./../../../shared/service-proxies/service-proxies";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { OrganizationUnitDto } from "@shared/service-proxies/service-proxies";
import { BsModalRef } from "ngx-bootstrap/modal";
import { AppComponentBase } from "@shared/app-component-base";
import {
  DropdownTreeviewComponent,
  TreeviewComponent,
  TreeviewConfig,
  TreeviewHelper,
  TreeviewI18n,
  TreeviewItem,
} from "ngx-treeview";
import { isNil } from "lodash-es";
import { Select2OptionData } from "ng-select2";
import { FileService } from "services/file.service";

@Component({
  selector: "app-create-organization",
  templateUrl: "./create-organization.component.html",
  styleUrls: ["./create-organization.component.css"],
})
export class CreateOrganizationComponent
  extends AppComponentBase
  implements OnInit
{
  photos: string[] = [];
  responseFile: any[] = [];
  //items:any[]=[];
  saving: any;
  org: CreateOrganizationUnitInput = new CreateOrganizationUnitInput();
  orgDrop: OrganizationUnitDto[] = [];
  selectedOrg: number;
  diaban: DiaBan[] = [];
  selectedDiaBan: number;
  id: number;
  @Output() onSave = new EventEmitter<any>();
  @ViewChild(TreeviewComponent, { static: false })
  treeviewComponent: TreeviewComponent;

  orgs: OrganizationViewTreeDto[] = [];
  isChange: boolean = false;
  //items: Select2OptionData[]=[];
  items: any[] = [];
  datas: Array<Select2OptionData>;
  item: Select2OptionData;
  isTinhSelect: boolean = false;
  SelectedTinh: any;
  SelectedHuyen: any;
  SelectedXa: any;
  tinh: any;
  huyen: any;
  xa: any;
  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private orgService: OrganizationUnitServiceServiceProxy,
    private cdref: ChangeDetectorRef,
    private fileService: FileService,
    public _diabanService: DiaBanServiceServiceProxy,
    private _userdvhcService: UserDVHCServiceServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    //this.getDiaBan();
    this.org.diaBanId = 0;

    this.orgService.getOrganizationUnitsViewDropdown(0).subscribe((rs) => {
      rs.forEach((el) => {
        this.items.push({ id: el.id.toString(), text: el.displayName });
      });
      this.datas = [...this.items];
      if (this.id != undefined) {
        this.isChange = true;

        this.getOrganizationByID();
      } else {
        this.org.diaBanId = 0;
        this.selectedOrg = rs != null ? rs[0].id : 0;
      }
    });

    //Dungnb code
    this.getAllTinh();
  }
  getDiaBan() {
    this._diabanService.getListDiaBan().subscribe((rs) => {
      this.diaban = rs;
    });
  }
  getItems(parentChildObj) {
    let itemsArray = [];
    parentChildObj.forEach((set) => {
      itemsArray.push(new TreeviewItem(set));
    });
    return itemsArray;
  }
  getOrganizationByID() {
    this.orgService.getOrganizationUnitsById(this.id).subscribe((rs) => {
      this.org = rs;
      //console.log(rs);
      this.selectedOrg = rs.parentId;
      //this.org.diaBanId = 0;
      //this.getAllTinh();
      this.SelectedTinh = rs.maTinh;
      //console.log(this.SelectedTinh);
      this.getHuyenByTinh(rs.maTinh);
      this.SelectedHuyen = rs.maHuyen;
      this.getXaByHuyen(rs.maHuyen);
      this.SelectedXa = rs.maXa
    });
  }
  save(): void {
    this.saving = true;
    this.org.parentId = this.selectedOrg;
    this.org.maTinh = this.SelectedTinh;
    this.org.maHuyen = this.SelectedHuyen;
    this.org.maXa = this.SelectedXa;
    //console.log(this.org.maTinh);
    if (this.id == undefined) {
      if (this.SelectedTinh == "0") {
        this.isTinhSelect = true;
        return;
      } else {
        this.orgService.createOrganizationUnit(this.org).subscribe(
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
      this.org.id = this.id;
      this.orgService.updateOrganizationUnit(this.org).subscribe(
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

  //Dungnb code
  ChangeXa() {
    console.log(this.SelectedXa);
    this.GetDiaBanByTHX();
  }
  GetDiaBanByTHX() {
    this._diabanService
      .getDiaBanByTHX(this.SelectedTinh, this.SelectedHuyen, this.SelectedXa)
      .subscribe((rs) => {
        this.diaban = rs;
      });
  }
  getHuyenByTinh(ma_tinh) {
    this.SelectedHuyen = "0";
    this._userdvhcService.getAllHuyen(ma_tinh).subscribe((rs) => {
      this.huyen = rs;
    });
  }
  getXaByHuyen(ma_huyen) {
    this.SelectedXa = "0";
    this._userdvhcService.getAllXa(ma_huyen).subscribe((rs) => {
      this.xa = rs;
    });
  }
  ChangeHuyen(ma_huyen) {
    this.getXaByHuyen(ma_huyen);
    this.GetDiaBanByTHX();
  }
  ChangeTinh(ma_tinh) {
    this.getHuyenByTinh(ma_tinh);
    this.SelectedXa = "0";
    this.GetDiaBanByTHX();
  }

  getAllTinh() {
    this.SelectedTinh = "0";
    this.SelectedHuyen = "0";
    this.SelectedXa = "0";
    this._userdvhcService.getAllTinh().subscribe((rs) => {
      this.tinh = rs;
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  private process(data): any {
    let result = [];
    result = data.map((item) => {
      return this.toTreeNode(item);
    });
    return result;
  }

  private toTreeNode(node, parent = null) {
    // console.log(node, parent);
    if (node && node.children) {
      node.children.map((item) => {
        return this.toTreeNode(item, node);
      });
    }
    return node;
  }
  removeOrganization() {
    this.orgService.deleteOrg(this.id).subscribe((rs) => {
      if (rs == true) {
        this.notify.info(this.l("Xóa thành công tổ chức"));
        this.bsModalRef.hide();
        this.onSave.emit();
      } else {
        this.notify.warn(
          this.l(
            "Phải xóa tổ chức trong báo cáo hoặc đối tượng trước khi xóa tổ chức!"
          )
        );
        this.bsModalRef.hide();
      }
    });
  }
}
