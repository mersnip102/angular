import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {CSDL3bChart, CSDL3bServiceServiceProxy} from '@shared/service-proxies/service-proxies';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-reports-csdl3b-chart',
    templateUrl: './csdl3b-chart.component.html',
    styleUrls: ['./csdl3b-chart.component.css']
})
export class Csdl3bChartComponent implements OnInit {
    private csdl3bChart: CSDL3bChart = new CSDL3bChart();

    constructor(
        private route: ActivatedRoute,
        private _csdl3bService: CSDL3bServiceServiceProxy,
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

        this._csdl3bService.getCSDL3bChart(managerCode)
            .subscribe(result => {
                this.csdl3bChart = result;
                this.barChartData = {
                    labels: [result.organization],
                    datasets: [
                        {data: [result.assignedCapital], label: 'Vốn đã giao'},
                        {data: [result.disbursedCapital], label: 'Vốn đã giải ngân'},
                        // {data: [result.percentage], label: 'Phần Trăm'},
                    ]
                };
                this.chart?.update();
            });
    }
}
