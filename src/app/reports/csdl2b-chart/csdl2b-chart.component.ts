import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {CSDL2bChart, CSDL2bServiceServiceProxy} from '@shared/service-proxies/service-proxies';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-reports-csdl2b-chart',
    templateUrl: './csdl2b-chart.component.html',
    styleUrls: ['./csdl2b-chart.component.css']
})
export class Csdl2bChartComponent implements OnInit {
    private csdl2bChart: CSDL2bChart = new CSDL2bChart();

    constructor(
        private route: ActivatedRoute,
        private _csdl2bService: CSDL2bServiceServiceProxy,
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

        this._csdl2bService.getCSDL2bChart(managerCode)
            .subscribe(result => {
                this.csdl2bChart = result;
                this.barChartData = {
                    labels: [result.organization],
                    datasets: [
                        {data: [result.assignedProject], label: 'Dự án đã giao vốn'},
                        {data: [result.disbursedProject], label: 'Số vốn đã giải ngân'},
                        // {data: [result.percentage], label: 'Phần Trăm'},
                    ]
                };
                this.chart?.update();
            });
    }
}
