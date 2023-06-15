import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {CSDL1Chart, CSDL1ServiceServiceProxy} from '@shared/service-proxies/service-proxies';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-reports-csdl1-chart',
    templateUrl: './csdl1-chart.component.html',
    styleUrls: ['./csdl1-chart.component.css']
})
export class Csdl1ChartComponent implements OnInit {
    private csdl1Chart: CSDL1Chart = new CSDL1Chart();

    constructor(
        private route: ActivatedRoute,
        private _csdl1Service: CSDL1ServiceServiceProxy,
        injector: Injector
    ) {
    }

    ngOnInit(): void {
        this.fetch();
    }

    @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

    public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: {
            x: {},
            y: {}
        },
        plugins: {
            legend: {
                display: true,
            },
            datalabels: {
                display: false
            }
        }
    };
    public barChartType: ChartType = 'bar';
    public barChartPlugins = [
        DataLabelsPlugin
    ];

    public barChartData: ChartData<'bar'> = {
        labels: [],
        datasets: []
    };

    private fetch() {
        const managerCode = this.route.snapshot.params['managerCode'];

        this._csdl1Service.getCSDL1Chart(managerCode)
            .subscribe(result => {
                this.csdl1Chart = result;
                this.barChartData = {
                    labels: [result.organization],
                    datasets: [
                        {data: [result.assigned], label: 'Được Giao'},
                        {data: [result.allotted], label: 'Phân Bổ'},
                        // {data: [result.percentage], label: 'Phần Trăm'},
                    ]
                };
                this.chart?.update();
            });
    }
}
