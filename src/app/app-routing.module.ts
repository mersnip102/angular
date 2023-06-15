import { DiabanComponent } from './diaban/diaban.component';
import { LoaidoituongComponent } from './loaidoituong/loaidoituong.component';
import { NhiemvuComponent } from './nhiemvu/nhiemvu.component';
import { ThongkenhacviecComponent } from './thongkenhacviec/thongkenhacviec.component';
import { UserdvhcComponent } from './userdvhc/userdvhc.component';
import { TaoBaocaoComponent } from './tao-baocao/tao-baocao.component';
import { UserinforComponent } from './users/userinfor/userinfor.component';

import { AuditLogComponent } from './audit-log/audit-log.component';
import { UserDoituongComponent } from './user-doituong/user-doituong.component';
import { OrganizationComponent } from './organization/organization.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from 'app/roles/roles.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { MapOpenlayersComponent } from './map-openlayers/map-openlayers.component';
import { DoituongsComponent } from './doituongs/doituongs.component';
import { NhacviecComponent } from './nhacviec/nhacviec.component';
import { PaknsComponent } from './pakns/pakns.component';
import { ConfigsComponent } from './configs/configs.component';
import { SearchpaknComponent } from './searchpakns/searchpakn.component';
import { CreatePaknComponent } from './pakns/create-pakn/create-pakn.component';
import { TestComponent } from './test/test.component';
import { DuyetBaocaoComponent } from './pakns/duyet-baocao/duyet-baocao.component';
import { XulyBaocaoComponent } from './pakns/xuly-baocao/xuly-baocao.component';
import { XemBaocaoComponent } from './pakns/xem-baocao/xem-baocao.component';
import { ChucDanhComponent } from './chucdanh/chucdanh.component';
import { SuKienComponent } from './sukien/sukien.component';
import { UserDoituongDuyetComponent } from './user-doituong-duyet/user-doituong-duyet.component';
import { UserDoituongXemComponent } from './user-doituong-xem/user-doituong-xem.component';
import {Csdl1Component} from './reports/csdl1/csdl1.component';
import {Csdl1ChartComponent} from './reports/csdl1-chart/csdl1-chart.component';
import {ImageReportComponent} from '@app/image-report/image-report.component';
import {Csdl2aChartComponent} from '@app/reports/csdl2a-chart/csdl2a-chart.component';
import {Csdl2bChartComponent} from '@app/reports/csdl2b-chart/csdl2b-chart.component';
import {Csdl3aChartComponent} from '@app/reports/csdl3a-chart/csdl3a-chart.component';
import {Csdl3bChartComponent} from '@app/reports/csdl3b-chart/csdl3b-chart.component';
import {Csdl4aChartComponent} from '@app/reports/csdl4a-chart/csdl4a-chart.component';
import {Csdl4bChartComponent} from '@app/reports/csdl4b-chart/csdl4b-chart.component';
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                    { path: 'home', component: HomeComponent,  canActivate: [AppRouteGuard] },
                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
                    { path: 'about', component: AboutComponent, canActivate: [AppRouteGuard] },
                    { path: 'update-password', component: ChangePasswordComponent, canActivate: [AppRouteGuard] },
                    { path: 'map-openlayers', component: MapOpenlayersComponent},
                    { path: 'org', component: OrganizationComponent},
                    { path: 'doituongs', component: DoituongsComponent,canActivate: [AppRouteGuard]},
                    { path: 'thongbao', component: NhacviecComponent,canActivate: [AppRouteGuard]},
                    { path: 'pakns', component: PaknsComponent,canActivate: [AppRouteGuard]},
                    { path: 'duyetbaocaos', component: DuyetBaocaoComponent,canActivate: [AppRouteGuard]},
                    { path: 'user-doituongs', component: UserDoituongComponent,canActivate: [AppRouteGuard]},
                    { path: 'audit-log', component: AuditLogComponent,canActivate: [AppRouteGuard]},
                    { path: 'configs', component: ConfigsComponent,canActivate: [AppRouteGuard]},
                    { path: 'searchpakns', component: SearchpaknComponent,canActivate: [AppRouteGuard]},
                    { path: 'userinfor', component: UserinforComponent},
                    { path: 'test', component: TestComponent,canActivate: [AppRouteGuard]},
                    // { path: 'taomoi', component: TaomoibaocaoComponent,canActivate: [AppRouteGuard]},
                    // { path: 'createbaocao', component: CreateBaocaoComponent,canActivate: [AppRouteGuard]},
                    // { path: 'createbaocao/:id', component: CreateBaocaoComponent,canActivate: [AppRouteGuard]},
                    { path: 'createpakn', component: CreatePaknComponent,canActivate: [AppRouteGuard]},
                    { path: 'createpakn/:id', component: CreatePaknComponent,canActivate: [AppRouteGuard]},
                    { path: 'tao-bao-cao', component: TaoBaocaoComponent,canActivate: [AppRouteGuard]},
                    { path: 'tao-bao-cao/:id', component: TaoBaocaoComponent,canActivate: [AppRouteGuard]},
                    { path: 'xulybaocao/:id', component: XulyBaocaoComponent,canActivate: [AppRouteGuard]},
                    { path: 'xembaocao/:id', component: XemBaocaoComponent,canActivate: [AppRouteGuard]},
                    { path: 'chucdanh', component: ChucDanhComponent,canActivate: [AppRouteGuard]},
                    { path: 'sukien', component: SuKienComponent,canActivate: [AppRouteGuard]},
                    { path: 'user-doituong-xem', component: UserDoituongXemComponent ,canActivate: [AppRouteGuard]},
                    { path: 'user-doituong-duyet', component: UserDoituongDuyetComponent ,canActivate: [AppRouteGuard]},
                    { path: 'userdvhc', component: UserdvhcComponent ,canActivate: [AppRouteGuard]},
                    { path: 'thongkenhacviec', component: ThongkenhacviecComponent ,canActivate: [AppRouteGuard]},
                    { path: 'nhiemvu', component: NhiemvuComponent ,canActivate: [AppRouteGuard]},
                    { path: 'loaidoituong', component: LoaidoituongComponent ,canActivate: [AppRouteGuard]},
                    { path: 'diaban', component: DiabanComponent ,canActivate: [AppRouteGuard]},
                    { path: 'reports/csdl1', component: Csdl1Component ,canActivate: [AppRouteGuard]},
                    { path: 'reports/csdl1/:managerCode/chart', component: Csdl1ChartComponent ,canActivate: [AppRouteGuard]},
                    { path: 'reports/csdl2a/:managerCode/chart', component: Csdl2aChartComponent ,canActivate: [AppRouteGuard]},
                    { path: 'reports/csdl2b/:managerCode/chart', component: Csdl2bChartComponent ,canActivate: [AppRouteGuard]},
                    { path: 'reports/csdl3a/:managerCode/chart', component: Csdl3aChartComponent ,canActivate: [AppRouteGuard]},
                    { path: 'reports/csdl3b/:managerCode/chart', component: Csdl3bChartComponent ,canActivate: [AppRouteGuard]},
                    { path: 'reports/csdl4a/:managerCode/chart', component: Csdl4aChartComponent ,canActivate: [AppRouteGuard]},
                    { path: 'reports/csdl4b/:managerCode/chart', component: Csdl4bChartComponent ,canActivate: [AppRouteGuard]},
                    { path: 'image-report', component: ImageReportComponent ,canActivate: [AppRouteGuard]},
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
