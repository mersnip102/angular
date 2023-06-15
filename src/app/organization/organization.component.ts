import { CreateOrganizationComponent } from './create-organization/create-organization.component';
import { OrganizationUnitServiceServiceProxy, OrganizationViewTreeDto } from './../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import {
  TreeviewItem, TreeviewConfig, TreeviewHelper, TreeviewComponent,
  TreeviewEventParser, OrderDownlineTreeviewEventParser, DownlineTreeviewItem, TreeviewI18n, DefaultTreeviewI18n
} from 'ngx-treeview';
import { isNil, reverse,remove } from 'lodash-es';
@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css'],
  providers: [
    { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser },
    { provide: TreeviewConfig },
    {
      provide: TreeviewI18n , useValue: Object.assign(new DefaultTreeviewI18n(), {
        getFilterPlaceholder(): string {
          return 'Tìm kiếm';
        }
     })
   }
  ]
})
export class OrganizationComponent extends AppComponentBase implements OnInit {
  displayedColumns: string[] = ['name', 'count'];
  @ViewChild(TreeviewComponent, { static: false }) treeviewComponent: TreeviewComponent;

  dropdownEnabled = true;
  items: TreeviewItem[];
  rows: string[];
  orgs:OrganizationViewTreeDto[]=[];
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: true,
  });
  constructor(injector: Injector,
    private treeviewI18nDefault: TreeviewI18n,
    private _modalService: BsModalService,
    private organizationService:OrganizationUnitServiceServiceProxy
  ) { super(injector);  }

   ngOnInit() {
  this.getOrganization();
  }
  getOrganization()
  {
    this.organizationService.getOrganizationUnitsViewTree().subscribe(rs=>{
      this.items =this.getItems(rs);

      })
  }
  getItems(parentChildObj) {
    let itemsArray = [];
    parentChildObj.forEach(set => {
      itemsArray.push(new TreeviewItem(set))
    });
    return itemsArray;
  }
  onSelectedChange($event)
  {
   // console.log(this.items);

  }
  // onSelectedChange(downlineItems: DownlineTreeviewItem[]): void {
  //   this.rows = [];
  //   downlineItems.forEach(downlineItem => {
  //     const item = downlineItem.item;
  //     const value = item.value;
  //     const texts = [item.text];
  //     let parent = downlineItem.parent;
  //     console.log(item)
  //     console.log(parent)
  //     while (!isNil(parent)) {
  //       texts.push(parent.item.text);
  //       parent = parent.parent;
  //     }
  //     const reverseTexts = reverse(texts);
  //     const row = `${reverseTexts.join(' -> ')} : ${value}`;
  //     this.rows.push(row);
  //   });
  // }
  removeItem(item: TreeviewItem): void {
    // console.log(item.value)
    // for (const tmpItem of this.items) {
    //   if (tmpItem === item) {

    //     //remove(this.items, item);
    //   } else {
    //     // if (TreeviewHelper.removeItem(tmpItem, item)) {
    //     //   break;
    //     // }
    //   }
    // }

    // this.treeviewComponent.raiseSelectedChange();
  }
  onFilterChange(value: string): void {
    // console.log('filter:', value);
  }
  createOrganzition()
  {
    this.showCreateOrEditUserDialog(null)
  }
  private showCreateOrEditUserDialog(item: TreeviewItem): void {

    let createOrEditUserDialog: BsModalRef;
    if (item==null) {
      createOrEditUserDialog = this._modalService.show(
        CreateOrganizationComponent,
        {
          class: 'modal-lg',
          animated: true,
          backdrop: 'static',
        }
      );
    } else {
      createOrEditUserDialog = this._modalService.show(
        CreateOrganizationComponent,
        {
          class: 'modal-lg',
          animated: true,
          backdrop: 'static',
          initialState: {
            id: item.value,
          },
        }
      );
    }

    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.getOrganization();
    });
  }

}
