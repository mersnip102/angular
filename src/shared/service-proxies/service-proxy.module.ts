import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AbpHttpInterceptor } from 'abp-ng2-module';

import * as ApiServiceProxies from './service-proxies';

//Sửa
@NgModule({
    providers: [
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.TenantServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.ConfigurationServiceProxy,
        ApiServiceProxies.OrganizationUnitServiceServiceProxy,
        ApiServiceProxies.DoiTuongServiceProxy,
        ApiServiceProxies.HistoryServiceProxy,
        ApiServiceProxies.NhacViecServiceServiceProxy,
        ApiServiceProxies.PAKNServiceProxy,
        ApiServiceProxies.AuditLogServiceServiceProxy,
        ApiServiceProxies.ConfigServiceServiceProxy,
        ApiServiceProxies.SearchPAKNServiceServiceProxy,
        ApiServiceProxies.ThongBaoNhacViecServiceServiceProxy,
        ApiServiceProxies.UserDoiTuongServiceServiceProxy,
        ApiServiceProxies.DVHCServiceServiceProxy,
        ApiServiceProxies.MediaServiceServiceProxy,
        ApiServiceProxies.CQueryableServiceServiceProxy,
        ApiServiceProxies.NotifyServiceServiceProxy,
        ApiServiceProxies.ChucDanhServiceServiceProxy,
        ApiServiceProxies.SuKienServiceServiceProxy,
        ApiServiceProxies.DuyetUserDoiTuongServiceServiceProxy,
        ApiServiceProxies.XemUserDoiTuongServiceServiceProxy,
        ApiServiceProxies.UserDeviceServiceServiceProxy,
        ApiServiceProxies.UserDVHCServiceServiceProxy,
        ApiServiceProxies.FcmFirebaseServiceProxy,
        ApiServiceProxies.DiaBanServiceServiceProxy,
        ApiServiceProxies.CSDL1ServiceServiceProxy,
        ApiServiceProxies.CSDL2aServiceServiceProxy,
        ApiServiceProxies.CSDL2bServiceServiceProxy,
        ApiServiceProxies.CSDL3aServiceServiceProxy,
        ApiServiceProxies.CSDL3bServiceServiceProxy,
        ApiServiceProxies.CSDL4aServiceServiceProxy,
        ApiServiceProxies.CSDL4bServiceServiceProxy,
        ApiServiceProxies.NhiemVuServiceServiceProxy,
        ApiServiceProxies.LoaiDoiTuongServiceServiceProxy,
        ApiServiceProxies.HomeServiceServiceProxy,
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class ServiceProxyModule { }
