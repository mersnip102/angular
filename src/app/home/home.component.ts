import {
    CQueryableServiceServiceProxy,
    CSDL1Dashboard,
    CSDL1ServiceServiceProxy,
    CSDL2aDashboard,
    CSDL2aServiceServiceProxy,
    CSDL2bDashboard,
    CSDL2bServiceServiceProxy,
    CSDL3aDashboard,
    CSDL3aServiceServiceProxy,
    CSDL3bDashboard,
    CSDL3bServiceServiceProxy, CSDL4aDashboard, CSDL4aServiceServiceProxy, CSDL4bDashboard, CSDL4bServiceServiceProxy,
    DTOTKPAKN,
    DVHCServiceServiceProxy,
    HomeServiceServiceProxy,
    HomeViewDto,
    ThongKeNhacViecDto,
    UserDVHC,
    UserServiceProxy,
} from './../../shared/service-proxies/service-proxies';
import {Component, Injector} from '@angular/core';
import {ENhomNguoiDung} from '@shared/constant/constant';
import {PagedListingComponentBase} from '@shared/paged-listing-component-base';
import {finalize} from 'rxjs/operators';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./homecomponent.css'],
})
export class HomeComponent extends PagedListingComponentBase<HomeViewDto> {
    protected delete(entity: HomeViewDto): void {
        throw new Error('Method not implemented.');
    }

    userId: number;
    data_thongbaoChung: HomeViewDto[] = [];
    data_thongbaoDK: ThongKeNhacViecDto[] = [];
    p: number = 1;
    checkNhomNguoiDung: number;
    xemBaoCaoDVHC: UserDVHC[] = [];
    pakns: DTOTKPAKN = new DTOTKPAKN();
    csdl1Dashboard: CSDL1Dashboard = new CSDL1Dashboard();
    csdl2aDashboard: CSDL2aDashboard = new CSDL2aDashboard();
    csdl2bDashboard: CSDL2bDashboard = new CSDL2bDashboard();
    csdl3aDashboard: CSDL3aDashboard = new CSDL3aDashboard();
    csdl3bDashboard: CSDL3bDashboard = new CSDL3bDashboard();
    csdl4aDashboard: CSDL4aDashboard = new CSDL4aDashboard();
    csdl4bDashboard: CSDL4bDashboard = new CSDL4bDashboard();
    currentDate = new Date();

    constructor(
        injector: Injector,
        private cQueryableService: CQueryableServiceServiceProxy,
        private _userService: UserServiceProxy,
        private dvhcservice: DVHCServiceServiceProxy,
        public _homeService: HomeServiceServiceProxy,
        private csdl1ServiceServiceProxy: CSDL1ServiceServiceProxy,
        private csdl2aServiceServiceProxy: CSDL2aServiceServiceProxy,
        private csdl2bServiceServiceProxy: CSDL2bServiceServiceProxy,
        private csdl3aServiceServiceProxy: CSDL3aServiceServiceProxy,
        private csdl3bServiceServiceProxy: CSDL3bServiceServiceProxy,
        private csdl4aServiceServiceProxy: CSDL4aServiceServiceProxy,
        private csdl4bServiceServiceProxy: CSDL4bServiceServiceProxy,
    ) {
        super(injector);
    }

    async ngOnInit(): Promise<void> {
        var rst = await this._userService
            .getRolesByUserID(this.appSession.user.id)
            .toPromise();
        if (rst.includes(ENhomNguoiDung.XemBaoCao)) {
            this.checkNhomNguoiDung = ENhomNguoiDung.XemBaoCao;
        } else if (rst.includes(ENhomNguoiDung.DuyetBaoCao)) {
            this.checkNhomNguoiDung = ENhomNguoiDung.DuyetBaoCao;
        } else if (rst.includes(ENhomNguoiDung.BaoCao)) {
            this.checkNhomNguoiDung = ENhomNguoiDung.BaoCao;
        } else if (rst.includes(ENhomNguoiDung.QuanTri)) {
            this.checkNhomNguoiDung = ENhomNguoiDung.QuanTri;
        } else {
        }
        //abp.notify.error("Chưa phân quyền nhóm người dùng", "", "Liên hệ tới ban quản trị để được phân quyền")

        if (this.checkNhomNguoiDung == ENhomNguoiDung.XemBaoCao) {
            this.xemBaoCaoDVHC = await this.dvhcservice
                .getDVHCPhanChoNguoiDung(this.appSession.user.id)
                .toPromise();
            //if(this.xemBaoCaoDVHC.length == 0)
            //abp.notify.error("Chưa phân quyền DVHC", "Chưa cấu hình đơn vị hành chính cho người dùng xem báo cáo", "Liên hệ tới ban quản trị để được phân quyền")
        }

        this.getThongBaoChung();
        this.getThongBaoDinhKy();
        this.getTKPAKN();
        this.getCSDLDashboard();
    }

    async getCSDLDashboard() {
        this.csdl1ServiceServiceProxy.getCSDL1Dashboard().subscribe(rs => {
            this.csdl1Dashboard = rs;
        });
        this.csdl2aServiceServiceProxy.getCSDL2aDashboard().subscribe(rs => {
            this.csdl2aDashboard = rs;
        });
        this.csdl2bServiceServiceProxy.getCSDL2bDashboard().subscribe(rs => {
            this.csdl2bDashboard = rs;
        });
        this.csdl3aServiceServiceProxy.getCSDL3aDashboard().subscribe(rs => {
            this.csdl3aDashboard = rs;
        });
        this.csdl3bServiceServiceProxy.getCSDL3bDashboard().subscribe(rs => {
            this.csdl3bDashboard = rs;
        });
        this.csdl4aServiceServiceProxy.getCSDL4aDashboard().subscribe(rs => {
            this.csdl4aDashboard = rs;
        });
        this.csdl4bServiceServiceProxy.getCSDL4bDashboard().subscribe(rs => {
            this.csdl4bDashboard = rs;
        });
    }

    async getTKPAKN() {
        let xemBC_DVHC = new Array();
        await this.xemBaoCaoDVHC.forEach((e) => {
            xemBC_DVHC.push(
                new Object({DVHC_MaTinh: e.dvhC_MaTinh, DVHC_MaHuyen: e.dvhC_MaHuyen})
            );
        });

        await this.cQueryableService
            .tKPAKN(
                '',
                '0',
                '0',
                '0',
                '',
                '',
                0,
                0,
                -1,
                0,
                this.checkNhomNguoiDung,
                xemBC_DVHC
            )
            .subscribe((rs) => {
                this.pakns = rs;
            });
    }

    getThongBaoChung() {
        this.userId = this.appSession.user.id;
        this._homeService.getThongBaoChung_Home(this.userId).subscribe((rs) => {
            this.data_thongbaoChung = rs;
        });
    }

    getThongBaoDinhKy() {
        this._homeService.getThongBaoDinhKy_Home(this.userId).subscribe((rs) => {
            this.data_thongbaoDK = rs;
        });
    }

    protected list(
        request: any,
        pageNumber: number,
        finishedCallback: Function
    ): void {
        this._homeService
            .getNhacViec(
                request.skipCount,
                request.maxResultCount,
                (this.userId = this.appSession.user.id)
            )
            .pipe(
                finalize(() => {
                    finishedCallback();
                })
            )
            .subscribe((result) => {
                this.data_thongbaoChung = result.items;
                this.showPaging(result, pageNumber);
                console.log(result);
            });
    }
}



