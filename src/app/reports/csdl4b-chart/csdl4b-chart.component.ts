import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {CSDL4bChart, CSDL4bServiceServiceProxy} from '@shared/service-proxies/service-proxies';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-reports-csdl4b-chart',
    templateUrl: './csdl4b-chart.component.html',
    styleUrls: ['./csdl4b-chart.component.css']
})
export class Csdl4bChartComponent implements OnInit {
    private csdl4bChart: CSDL4bChart = new CSDL4bChart();

    constructor(
        private route: ActivatedRoute,
        private _csdl4bService: CSDL4bServiceServiceProxy,
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

        this._csdl4bService.getCSDL4bChart(managerCode)
            .subscribe(result => {
                this.csdl4bChart = result;
                this.barChartData = {
                    labels: [result.organization],
                    datasets: [
                        {data: [result.pendingMission], label: 'Nhiệm vụ đề nghị QT'},
                        {data: [result.approvedMission], label: 'Nhiệm vụ đã được QT'},
                        // {data: [result.percentage], label: 'Phần Trăm'},
                    ]
                };
                this.chart?.update();
            });
    }
}
