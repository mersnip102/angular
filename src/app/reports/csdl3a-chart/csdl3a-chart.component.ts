import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {CSDL3aChart, CSDL3aServiceServiceProxy} from '@shared/service-proxies/service-proxies';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-reports-csdl3a-chart',
    templateUrl: './csdl3a-chart.component.html',
    styleUrls: ['./csdl3a-chart.component.css']
})
export class Csdl3aChartComponent implements OnInit {
    private csdl3aChart: CSDL3aChart = new CSDL3aChart();

    constructor(
        private route: ActivatedRoute,
        private _csdl3aService: CSDL3aServiceServiceProxy,
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

        this._csdl3aService.getCSDL3aChart(managerCode)
            .subscribe(result => {
                this.csdl3aChart = result;
                this.barChartData = {
                    labels: [result.organization],
                    datasets: [
                        {data: [result.assignedMission], label: 'Nhiệm vụ đã giao'},
                        {data: [result.approvedMission], label: 'Nhiệm vụ đã duyệt'},
                        // {data: [result.percentage], label: 'Phần Trăm'},
                    ]
                };
                this.chart?.update();
            });
    }
}
