import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {CSDL2aChart, CSDL2aServiceServiceProxy} from '@shared/service-proxies/service-proxies';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-reports-csdl2a-chart',
    templateUrl: './csdl2a-chart.component.html',
    styleUrls: ['./csdl2a-chart.component.css']
})
export class Csdl2aChartComponent implements OnInit {
    private csdl2aChart: CSDL2aChart = new CSDL2aChart();

    constructor(
        private route: ActivatedRoute,
        private _csdl2aService: CSDL2aServiceServiceProxy,
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

        this._csdl2aService.getCSDL2aChart(managerCode)
            .subscribe(result => {
                this.csdl2aChart = result;
                this.barChartData = {
                    labels: [result.organization],
                    datasets: [
                        {data: [result.browser], label: 'Được Giao'},
                        {data: [result.decided], label: 'Phân Bổ'},
                        // {data: [result.percentage], label: 'Phần Trăm'},
                    ]
                };
                this.chart?.update();
            });
    }
}
