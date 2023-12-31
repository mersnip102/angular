import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from '@shared/app-component-base';
import {
    Router,
    RouterEvent,
    NavigationEnd,
    PRIMARY_OUTLET
} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {MenuItem} from '@shared/layout/menu-item';

@Component({
    selector: 'sidebar-menu',
    templateUrl: './sidebar-menu.component.html'
})
export class SidebarMenuComponent extends AppComponentBase implements OnInit {
    menuItems: MenuItem[];
    menuItemsMap: { [key: number]: MenuItem } = {};
    activatedMenuItems: MenuItem[] = [];
    routerEvents: BehaviorSubject<RouterEvent> = new BehaviorSubject(undefined);
    homeRoute = '/app/home';

    constructor(injector: Injector, private router: Router) {
        super(injector);
        this.router.events.subscribe(this.routerEvents);
    }

    ngOnInit(): void {
        this.menuItems = this.getMenuItems();
        this.patchMenuItems(this.menuItems);
        this.routerEvents
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event) => {
                const currentUrl = event.url !== '/' ? event.url : this.homeRoute;
                const primaryUrlSegmentGroup = this.router.parseUrl(currentUrl).root
                    .children[PRIMARY_OUTLET];
                if (primaryUrlSegmentGroup) {
                    this.activateMenuItems('/' + primaryUrlSegmentGroup.toString());
                }
            });
    }

    getMenuItems(): MenuItem[] {
        return [
            // new MenuItem(this.l('About'), '/app/about', 'fas fa-info-circle'),
            new MenuItem('Trang chủ', '/app/home', 'fas fa-home'),
            new MenuItem(
                this.l('Roles'),
                '/app/roles',
                'fas fa-theater-masks',
                'Pages.Roles'
            ),
            // new MenuItem(
            //     this.l('Tenants'),
            //     '/app/tenants',
            //     'fas fa-building',
            //     'Pages.Tenants'
            // ),
            new MenuItem(
                this.l('Users'),
                '/app/users',
                'fas fa-users',
                'Pages.Users'
            ),
            new MenuItem(
                "Quản lý tổ chức",//langues
                '/app/org', //đường dẫn
                'fas fa-list',
                'Pages.Organzition' //phân quyền
            ),
            new MenuItem('Quản lý danh mục','', 'fas fa-th-list', 'Pages.ChucDanh', [
                new MenuItem(
                    "Danh mục chức danh",//langues
                    '/app/chucdanh', //đường dẫn
                    'fas fa-folder',
                    'Pages.ChucDanh' //phân quyền
                ),
                new MenuItem(
                    "Danh mục sự kiện",//langues
                    '/app/sukien', //đường dẫn
                    'fas fa-list-alt',
                    'Pages.SuKien' //phân quyền
                ),
                new MenuItem(
                    "Danh mục nhiệm vụ",//langues
                    '/app/nhiemvu', //đường dẫn
                    'fas fa-folder',
                    'Pages.NhiemVu' //phân quyền
                ),
                new MenuItem(
                    "Danh mục loại đối tượng",//langues
                    '/app/loaidoituong', //đường dẫn
                    'fas fa-list-alt',
                    'Pages.LoaiDT' //phân quyền
                ),
                // new MenuItem(
                //     "Danh mục địa bàn",//langues
                //     '/app/diaban', //đường dẫn
                //     'fas fa-code',
                //     'Pages.DiaBan' //phân quyền
                // ),
            ]),
            new MenuItem(
                "Quản lý đối tượng",//langues
                '/app/doituongs', //đường dẫn
                'fas fa-user-cog', //icon
                'Pages.DoiTuongs' //phân quyền
            ),
            new MenuItem('Quản lý nhắc việc','', 'fas fa-dot-circle', 'Pages.NhacViecs', [
                new MenuItem(
                    "Cấu hình nhắc việc",//langues
                    '/app/user-doituongs', //đường dẫn
                    'fas fa-tasks',
                    'Pages.NhacViecs' //phân quyền
                ),
                new MenuItem(
                    "Cấu hình duyệt nhắc việc",//langues
                    '/app/user-doituong-duyet', //đường dẫn
                    'fas fa-equals',
                    'Pages.NhacViec.Duyet' //phân quyền
                ),
                new MenuItem(
                    "Cấu hình xem nhắc việc",//langues
                    '/app/user-doituong-xem', //đường dẫn
                    'fas fa-users-cog',
                    'Pages.NhacViec.Xem' //phân quyền
                ),
            ]),
            new MenuItem(
                "Quản lý thông báo chung",//langues
                '/app/thongbao', //đường dẫn
                'fas fa-bell',
                'Pages.NhacViecs' //phân quyền
            ),
            new MenuItem(
                'Bản đồ',
                '/app/map-openlayers', //đường dẫn
                'fas fa-map',
                'Pages.Map' //phân quyền
            ),
            new MenuItem(
                "Tra cứu PAKN",//langues
                '/app/searchpakns', //đường dẫn
                'fas fa fa-search', //icon
                'Pages.TraCuuPAKN' //phân quyền
            ),
            new MenuItem(
                "Tạo mới báo cáo",//langues
                '/app/pakns', //đường dẫn
                'fas fa-file',
                'Pages.BaoCao.TaoMoi' //phân quyền
            ),
            new MenuItem(
                "Duyệt báo cáo",//langues
                '/app/duyetbaocaos', //đường dẫn
                'fa fa-check',
                'Pages.BaoCao.PheDuyet' //phân quyền
            ),


            new MenuItem(
                "Quản lý log",//langues
                '/app/audit-log', //đường dẫn
                'fas fa-wrench',
                'Pages.AuditLog' //phân quyền
            ),
            new MenuItem(
                "Quản lý cấu hình",//langues
                '/app/configs', //đường dẫn
                'fas fa-unlink',
                'Pages.Configs' //phân quyền
            ),
            new MenuItem(
                "Thống kê nhắc việc",//langues
                '/app/thongkenhacviec', //đường dẫn
                'fas fa-list-alt',
                'Pages.TK_NhacViec' //phân quyền
            ),
            new MenuItem(
                "Gán người dùng vào DVHC",//langues
                '/app/userdvhc', //đường dẫn
                'fas fa-address-card',
                'Pages.UserDVHC' //phân quyền
            ),






            // ,
            // new MenuItem(this.l('MultiLevelMenu'), '', 'fas fa-circle', '', [
            //     new MenuItem('ASP.NET Boilerplate', '', 'fas fa-dot-circle', '', [
            //         new MenuItem(
            //             'Home',
            //             'https://aspnetboilerplate.com?ref=abptmpl',
            //             'far fa-circle'
            //         ),
            //         new MenuItem(
            //             'Templates',
            //             'https://aspnetboilerplate.com/Templates?ref=abptmpl',
            //             'far fa-circle'
            //         ),
            //         new MenuItem(
            //             'Samples',
            //             'https://aspnetboilerplate.com/Samples?ref=abptmpl',
            //             'far fa-circle'
            //         ),
            //         new MenuItem(
            //             'Documents',
            //             'https://aspnetboilerplate.com/Pages/Documents?ref=abptmpl',
            //             'far fa-circle'
            //         ),
            //     ]),
            //     new MenuItem('ASP.NET Zero', '', 'fas fa-dot-circle', '', [
            //         new MenuItem(
            //             'Home',
            //             'https://aspnetzero.com?ref=abptmpl',
            //             'far fa-circle'
            //         ),
            //         new MenuItem(
            //             'Features',
            //             'https://aspnetzero.com/Features?ref=abptmpl',
            //             'far fa-circle'
            //         ),
            //         new MenuItem(
            //             'Pricing',
            //             'https://aspnetzero.com/Pricing?ref=abptmpl#pricing',
            //             'far fa-circle'
            //         ),
            //         new MenuItem(
            //             'Faq',
            //             'https://aspnetzero.com/Faq?ref=abptmpl',
            //             'far fa-circle'
            //         ),
            //         new MenuItem(
            //             'Documents',
            //             'https://aspnetzero.com/Documents?ref=abptmpl',
            //             'far fa-circle'
            //         )
            //     ])
            // ])
        ];
    }

    patchMenuItems(items: MenuItem[], parentId?: number): void {
        items.forEach((item: MenuItem, index: number) => {
            item.id = parentId ? Number(parentId + '' + (index + 1)) : index + 1;
            if (parentId) {
                item.parentId = parentId;
            }
            if (parentId || item.children) {
                this.menuItemsMap[item.id] = item;
            }
            if (item.children) {
                this.patchMenuItems(item.children, item.id);
            }
        });
    }

    activateMenuItems(url: string): void {
        this.deactivateMenuItems(this.menuItems);
        this.activatedMenuItems = [];
        const foundedItems = this.findMenuItemsByUrl(url, this.menuItems);
        foundedItems.forEach((item) => {
            this.activateMenuItem(item);
        });
    }

    deactivateMenuItems(items: MenuItem[]): void {
        items.forEach((item: MenuItem) => {
            item.isActive = false;
            item.isCollapsed = true;
            if (item.children) {
                this.deactivateMenuItems(item.children);
            }
        });
    }

    findMenuItemsByUrl(
        url: string,
        items: MenuItem[],
        foundedItems: MenuItem[] = []
    ): MenuItem[] {
        items.forEach((item: MenuItem) => {
            if (item.route === url) {
                foundedItems.push(item);
            } else if (item.children) {
                this.findMenuItemsByUrl(url, item.children, foundedItems);
            }
        });
        return foundedItems;
    }

    activateMenuItem(item: MenuItem): void {
        item.isActive = true;
        if (item.children) {
            item.isCollapsed = false;
        }
        this.activatedMenuItems.push(item);
        if (item.parentId) {
            this.activateMenuItem(this.menuItemsMap[item.parentId]);
        }
    }

    isMenuItemVisible(item: MenuItem): boolean {
        if (!item.permissionName) {
            return true;
        }
        return this.permission.isGranted(item.permissionName);
    }
}
