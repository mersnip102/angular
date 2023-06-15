import { OrganizationComponent } from './organization.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeviewModule } from 'ngx-treeview';

const routes: Routes = [
  {
    path:'',
    component:OrganizationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),
    TreeviewModule.forRoot()
  ],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
