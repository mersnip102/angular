import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {CSDL4aChart, CSDL4aServiceServiceProxy} from '@shared/service-proxies/service-proxies';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-reports-csdl4a-chart',
    templateUrl: './csdl4a-chart.component.html',
    styleUrls: ['./csdl4a-chart.component.css']
})
export class Csdl4aChartComponent implements OnInit {
    private csdl4aChart: CSDL4aChart = new CSDL4aChart();

    constructor(
        private route: ActivatedRoute,
        private _csdl4aService: CSDL4aServiceServiceProxy,
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

        this._csdl4aService.getCSDL4aChart(managerCode)
            .subscribe(result => {
                this.csdl4aChart = result;
                this.barChartData = {
                    labels: [result.organization],
                    datasets: [
                        {data: [result.pendingProject], label: 'Dự án đề nghị QT'},
                        {data: [result.approvedProject], label: 'Dự án đã được QT'},
                        // {data: [result.percentage], label: 'Phần Trăm'},
                    ]
                };
                this.chart?.update();
            });
    }
}
