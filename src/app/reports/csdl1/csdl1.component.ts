import {Component, OnInit} from '@angular/core';
import {CSDL1ReportResponse, CSDL1ServiceServiceProxy} from '@shared/service-proxies/service-proxies';
import {CSDL1ReportItem} from '../../../shared/service-proxies/service-proxies';

@Component({
    selector: 'app-reports-csdl1',
    templateUrl: './csdl1.component.html',
    styleUrls: ['./csdl1.component.css']
})
export class Csdl1Component implements OnInit {
    report: CSDL1ReportResponse = new CSDL1ReportResponse();
    organizationLevel = '';
    csdl1Items: CSDL1ReportItem[] = [];

    constructor(
        private _csdl1Service: CSDL1ServiceServiceProxy
    ) {
    }

    ngOnInit(): void {
        this.fetch();
    }

    private fetch() {
        this._csdl1Service.getCSDL1Reports()
            .subscribe(result => {
                this.report = result;
                this.csdl1Items = result.items;
                this.organizationLevel = result.organizationLevel;
            });
    }
}
