import { Component, Injector } from '@angular/core';


export class RoleModels {
    id: number;
    description: string;
    displayName:string;
    grantedPermissions : grantedPermissons[]
    name:string;
    normalizedName:string;
    isChecked:boolean;
}

export class grantedPermissons{


}