import { OrganizationUnit, User } from './../../../shared/service-proxies/service-proxies';
import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from '@angular/core';
import { forEach as _forEach, includes as _includes, map as _map } from 'lodash-es';
import { AppComponentBase } from '@shared/app-component-base';
import {
  UserServiceProxy,
  UserDto,
  RoleDto,
  OrganizationUnitServiceServiceProxy,
  OrganizationUnitDto,
} from '@shared/service-proxies/service-proxies';
import { Select2OptionData } from 'ng-select2';
import { AppInitService } from 'services/app-init.service';
import { Options } from 'select2';
import * as moment from 'moment';
@Component({
  selector: 'app-userinfor',
  templateUrl: './userinfor.component.html',
  styleUrls: ['./userinfor.component.css']
})

export class UserinforComponent extends AppComponentBase implements OnInit{
  saving = false;
  user = new UserDto();
  roles: RoleDto[] = [];
  organs: OrganizationUnitDto[] = [];
  checkedRolesMap: { [key: string]: boolean } = {};
  checkedOrgransMap = {};
  id: number;
  org:any;
  orgSelected:any[]=[];
  role_:any[]=[];
  response: {dbPath: ''};
  @Output() onSave = new EventEmitter<any>();
  items: any;
  dataOrgs:any[]=[];
  datas:any[]=[];
  fileImageUrl:string;
  items_chucvu:any[] =[];
  chucDanhSelected:number;
  data_chucDanh:any[] =[];
  organization:OrganizationUnit[]=[];
  public options: Options;
  public avatar:string;
  constructor(
    injector: Injector,
    public _userService: UserServiceProxy,
    private organizationService:OrganizationUnitServiceServiceProxy,
    private config: AppInitService,
    private ref: ChangeDetectorRef
  ) {
    super(injector);
    this.fileImageUrl=this.config.baseUrl.imgUrl;
    this.options = {
      multiple: true,
      tags: true
    };
    this.fileImageUrl=this.config.baseUrl.imgUrl;
  }

  async ngOnInit(): Promise<void> {
    this.id=this.appSession.user.id;
    this.getOrganization();
    this.getChucDanh();
    if(this.id !=undefined)
    {
      this._userService.getInfoUser(this.id).subscribe((rs) => {
        this.user =rs;
        this.orgSelected = rs.userOrg
        // if(rs.toChuc != null || rs.toChuc !=undefined)
        // {
        //   rs.toChuc.forEach(r=>{
        //     this.orgSelected.push(r.id.toString());
        //   })
        //   this.orgSelected = this.orgSelected
        // }
        // else{
        //   rs.toChuc =[];
        // }
        this.setInitialRolesStatus();
        this.avatar =  rs.avatar!=null? rs.avatar:"/Resources/Images/user.png";
        this.chucDanhSelected = rs.chucDanhId!=undefined?rs.chucDanhId:0;
      })
    }

    this._userService.getRoles().subscribe((result2) => {
      this.roles = result2.items;
      this.setInitialRolesStatus();
    });
  }
  ChangeOrg($event)
  {
    // console.log(this.orgSelected)
  }
  getChucDanh()
  {
    this._userService.getChucDanh().subscribe(rs=>{
      rs.forEach(el=>{
        this.items_chucvu.push({'id': el.id.toString(),'text': el.tenChucDanh})
      });
      if(this.data_chucDanh !=undefined || this.data_chucDanh != null)
      {
        this.data_chucDanh= [...this.items_chucvu];
      }

    })
  }
  getOrganization()
  {
    //this.orgSelected=0;
    //Lấy dữ liệu cây tổ chức
      this.organizationService.getOrganizationUnitsViewDropdown(0).subscribe(rs=>{
        rs.forEach(el=>{
          this.dataOrgs.push({ 'id': el.id.toString(), 'text': el.displayName });
        });
        this.datas= [...this.dataOrgs];
     })
  }
  setInitialRolesStatus(): void {
    _map(this.roles, (item) => {
      this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
        item.normalizedName
      );

    });
  }

  isRoleChecked(normalizedName: string): boolean {
    //console.log(this.user.roleNames);
    return _includes(this.user.roleNames, normalizedName);
  }

  onRoleChange(role: RoleDto, $event) {
    this.checkedRolesMap[role.normalizedName] = $event.target.checked;
  }

  getCheckedRoles(): string[] {
    const roles: string[] = [];
    _forEach(this.checkedRolesMap, function (value, key) {
      if (value) {
        roles.push(key);
      }
    });
    return roles;
  }

  // save(): void {
  //   this.saving = true;
  //   this.user.userOrg = this.orgSelected;
  //   this.user.chucDanhId = this.chucDanhSelected;
  //   this.user.roleNames = this.getCheckedRoles();
  //   this.user.avatar=this.response!=undefined?this.response.dbPath:"Resources/images/user.png";
  //   this._userService.update(this.user).subscribe(
  //     () => {
  //       this.notify.info(this.l('SavedSuccessfully'));
  //       this.onSave.emit();
  //     },
  //     () => {
  //       this.saving = false;
  //     }
  //   );
  // }
  save()
  {
    this.saving = true;
    // if(this.response!=null)
    // {
    //   this.user.avatar=this.response.dbPath;
    // }
    // else
    // {
    //   this.user.avatar=this.avatar;
    // }
    //this.user.avatar = (this.response!=null||this.avatar!="") ?this.response.dbPath:"Resources/images/user.png";
    this.user.chucDanhId = this.chucDanhSelected;
    this._userService.updateUserInfor(this.user).subscribe( ()=>{
      this.notify.info(this.l('SavedSuccessfully'));
      this.onSave.emit();
      // this.refresh();
    },
    () =>{
      this.saving = false;
    });
  }
  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  uploadFinished = (event) => {
    this.response = event;
  }
}
