import {HeadernotifyComponent} from './layout/headernotify.component';
import {TestComponent} from './test/test.component';
import {UploadMediaComponent} from '@shared/components/upload-media/upload-media.component';
import {AppInitService} from './../services/app-init.service';
import {NotifyCommonService} from './../services/notify-common.service';
import {UploadMultiComponent} from '@shared/components/upload-multi/upload-multi.component';
import {UploadComponent} from '@shared/components/upload/upload.component';
import {CreateOrganizationComponent} from './organization/create-organization/create-organization.component';
import {OrganizationComponent} from './organization/organization.component';
import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientJsonpModule} from '@angular/common/http';
import {HttpClientModule} from '@angular/common/http';
import {ModalModule} from 'ngx-bootstrap/modal';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {NgxPaginationModule} from 'ngx-pagination';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ServiceProxyModule} from '@shared/service-proxies/service-proxy.module';
import {SharedModule} from '@shared/shared.module';
import {HomeComponent} from '@app/home/home.component';
import {AboutComponent} from '@app/about/about.component';
// tenants
import {TenantsComponent} from '@app/tenants/tenants.component';
import {CreateTenantDialogComponent} from './tenants/create-tenant/create-tenant-dialog.component';
import {EditTenantDialogComponent} from './tenants/edit-tenant/edit-tenant-dialog.component';
//danhmucs
import {ChucDanhComponent} from '@app/chucdanh/chucdanh.component';
import {CreateChucDanhComponent} from '@app/chucdanh/create-chucdanh/create-chucdanh.component';
import {SuKienComponent} from '@app/sukien/sukien.component';
import {CreateSuKienComponent} from '@app/sukien/create-sukien/create-sukien.component';

// roles
import {RolesComponent} from '@app/roles/roles.component';
import {CreateRoleDialogComponent} from './roles/create-role/create-role-dialog.component';
import {EditRoleDialogComponent} from './roles/edit-role/edit-role-dialog.component';
// users
import {UsersComponent} from '@app/users/users.component';
import {CreateUserDialogComponent} from '@app/users/create-user/create-user-dialog.component';
import {EditUserDialogComponent} from '@app/users/edit-user/edit-user-dialog.component';
import {ChangePasswordComponent} from './users/change-password/change-password.component';
import {ResetPasswordDialogComponent} from './users/reset-password/reset-password.component';
// layout
import {HeaderComponent} from './layout/header.component';
import {HeaderLeftNavbarComponent} from './layout/header-left-navbar.component';
import {HeaderLanguageMenuComponent} from './layout/header-language-menu.component';
import {HeaderUserMenuComponent} from './layout/header-user-menu.component';
import {FooterComponent} from './layout/footer.component';
import {SidebarComponent} from './layout/sidebar.component';
import {SidebarLogoComponent} from './layout/sidebar-logo.component';
import {SidebarUserPanelComponent} from './layout/sidebar-user-panel.component';
import {SidebarMenuComponent} from './layout/sidebar-menu.component';
import {MapOpenlayersComponent} from './map-openlayers/map-openlayers.component';

import {CoordinateFormatterService} from 'services/coordinate-formatter.service';
import {TreeviewModule} from 'ngx-treeview';
import {DoituongsComponent} from './doituongs/doituongs.component';
import {CreateDoituongComponent} from './doituongs/create-doituong/create-doituong.component';
import {NhacviecComponent} from './nhacviec/nhacviec.component';
import {CreateNhacviecComponent} from './nhacviec/create-nhacviec/create-nhacviec.component';
import {PaknsComponent} from './pakns/pakns.component';
import {CreatePaknComponent} from './pakns/create-pakn/create-pakn.component';
import {NgSelect2Module} from 'ng-select2';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {UserDoituongComponent} from './user-doituong/user-doituong.component';
import {AuditLogComponent} from './audit-log/audit-log.component';


import {ConfigsComponent} from './configs/configs.component';
import {CreateModalConfigComponent} from './configs/create-modal-config/create-modal-config.component';
import {SearchpaknComponent} from './searchpakns/searchpakn.component';
import {HeaderThongBaoComponent} from './layout/headerthongbao.component';
import {UserinforComponent} from './users/userinfor/userinfor.component';
import {ModalMapComponent} from './test/modal-map/modal-map.component';
import {NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {environment} from '../environments/environment';

import {MapComponent} from './map-openlayers/components/map/map.component';
import {UploadMultifileComponent} from '@shared/components/upload-multifile/upload-multifile.component';


import {XulyBaocaoComponent} from './pakns/xuly-baocao/xuly-baocao.component';
import {DuyetBaocaoComponent} from './pakns/duyet-baocao/duyet-baocao.component';
import {XemBaocaoComponent} from './pakns/xem-baocao/xem-baocao.component';
import {NgxEditorModule} from 'ngx-editor';
import {UploadImageComponent} from '@shared/components/upload-image/upload-image.component';
import {TaoBaocaoComponent} from './tao-baocao/tao-baocao.component';
import {UserDoituongDuyetComponent} from './user-doituong-duyet/user-doituong-duyet.component';
import {UserDoituongXemComponent} from './user-doituong-xem/user-doituong-xem.component';
import {UserdvhcComponent} from './userdvhc/userdvhc.component';
import {RxSpeechRecognitionService, SpeechRecognitionModule, SpeechRecognitionService} from '@kamiazya/ngx-speech-recognition';
import {ThongkenhacviecComponent} from './thongkenhacviec/thongkenhacviec.component';
import {NhiemvuComponent} from './nhiemvu/nhiemvu.component';
import {CreateNhiemvuComponent} from './nhiemvu/create-nhiemvu/create-nhiemvu.component';
import {LoaidoituongComponent} from './loaidoituong/loaidoituong.component';
import {CreateLoaidoituongComponent} from './loaidoituong/create-loaidoituong/create-loaidoituong.component';
import {DiabanComponent} from './diaban/diaban.component';
import {CreatDiabanComponent} from './diaban/creat-diaban/creat-diaban.component';
import {MyDatePickerModule} from 'mydatepicker';
import {NgbDateCustomParserFormatter} from '../shared/utils/fomat.datepicker';
import {TableCellComponent} from './home/table-cell/table-cell.component';
import {TableTitleCellComponent} from './home/table-title-cell/table-title-cell.component';
import {Csdl1Component} from './reports/csdl1/csdl1.component';
import {NgChartsModule} from 'ng2-charts';
import { Csdl1ChartComponent } from './reports/csdl1-chart/csdl1-chart.component';
import { ImageReportComponent } from './image-report/image-report.component';
import {Csdl2aChartComponent} from '@app/reports/csdl2a-chart/csdl2a-chart.component';
import {Csdl2bChartComponent} from '@app/reports/csdl2b-chart/csdl2b-chart.component';
import {Csdl4aChartComponent} from '@app/reports/csdl4a-chart/csdl4a-chart.component';
import {Csdl3aChartComponent} from '@app/reports/csdl3a-chart/csdl3a-chart.component';
import {Csdl3bChartComponent} from '@app/reports/csdl3b-chart/csdl3b-chart.component';
import {Csdl4bChartComponent} from '@app/reports/csdl4b-chart/csdl4b-chart.component';
// import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
    declarations: [
        UploadComponent,
        AppComponent,
        HomeComponent,
        AboutComponent,
        // tenants
        TenantsComponent,
        CreateTenantDialogComponent,
        EditTenantDialogComponent,
        // roles
        RolesComponent,
        CreateRoleDialogComponent,
        EditRoleDialogComponent,


        // users
        UsersComponent,
        CreateUserDialogComponent,
        EditUserDialogComponent,
        ChangePasswordComponent,
        ResetPasswordDialogComponent,
        //danhmucs
        ChucDanhComponent,
        CreateChucDanhComponent,
        SuKienComponent,
        CreateSuKienComponent,
        // EditChucDanhComponent,
        // layout
        HeaderComponent,
        HeaderLeftNavbarComponent,
        HeaderLanguageMenuComponent,
        HeaderUserMenuComponent,
        FooterComponent,
        SidebarComponent,
        SidebarLogoComponent,
        SidebarUserPanelComponent,
        SidebarMenuComponent,
        MapOpenlayersComponent,
        OrganizationComponent,
        DoituongsComponent,
        CreateDoituongComponent,
        NhacviecComponent,
        CreateNhacviecComponent,
        PaknsComponent,
        CreatePaknComponent,
        CreateOrganizationComponent,
        UploadMultiComponent,
        UserDoituongComponent,
        UploadMediaComponent,
        TestComponent,
        AuditLogComponent,
        ConfigsComponent,
        CreateModalConfigComponent,
        SearchpaknComponent,
        HeaderThongBaoComponent,
        UserinforComponent,
        ModalMapComponent,
        HeadernotifyComponent,
        MapComponent,
        UploadMultifileComponent,
        UserDoituongDuyetComponent,
        UserDoituongXemComponent,
        XulyBaocaoComponent,
        DuyetBaocaoComponent,
        XemBaocaoComponent,
        UploadImageComponent,
        TaoBaocaoComponent,
        UserdvhcComponent,
        ThongkenhacviecComponent,
        NhiemvuComponent,
        CreateNhiemvuComponent,
        LoaidoituongComponent,
        CreateLoaidoituongComponent,
        DiabanComponent,
        CreatDiabanComponent,
        TableCellComponent,
        TableTitleCellComponent,
        Csdl1Component,
        Csdl1ChartComponent,
        Csdl2aChartComponent,
        Csdl2bChartComponent,
        Csdl3aChartComponent,
        Csdl3bChartComponent,
        Csdl4aChartComponent,
        Csdl4bChartComponent,
        ImageReportComponent
    ],
    imports: [
        // PdfViewerModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        ModalModule.forChild(),
        BsDropdownModule,
        CollapseModule,
        TabsModule,
        AppRoutingModule,
        ServiceProxyModule,
        SharedModule,
        NgxPaginationModule,
        TreeviewModule.forRoot(),
        NgSelect2Module,
        CKEditorModule,
        NgbModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        NgxEditorModule,
        SpeechRecognitionModule.withConfig({
            lang: 'vi-VN',
            interimResults: true,
            maxAlternatives: 1,
        }),
        MyDatePickerModule,
        NgChartsModule
    ],
    providers: [
        CoordinateFormatterService,
        DecimalPipe,
        AppInitService,
        NotifyCommonService,
        SpeechRecognitionService, RxSpeechRecognitionService,
        {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
    ],
    entryComponents: [
        // tenants
        CreateTenantDialogComponent,
        EditTenantDialogComponent,
        // roles
        CreateRoleDialogComponent,
        EditRoleDialogComponent,
        // users
        CreateUserDialogComponent,
        EditUserDialogComponent,
        ResetPasswordDialogComponent,
        UploadComponent,
        UploadMultiComponent
    ],
    exports: [
        NgSelect2Module,
        SharedModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
