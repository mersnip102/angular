import { NgSelect2Module } from 'ng-select2';
import { TreeviewModule } from 'ngx-treeview';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationRoutingModule } from './organization-routing.module';
import { OrganizationComponent } from './organization.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateOrganizationComponent } from './create-organization/create-organization.component';
@NgModule({
  declarations: [
    OrganizationComponent,
    CreateOrganizationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OrganizationRoutingModule,
    TreeviewModule.forRoot(),

  ]
})
export class OrganizationModule { }
