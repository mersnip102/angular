import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-home-table-cell',
    templateUrl: './table-cell.component.html',
    styleUrls: ['./table-cell.component.css']
})
export class TableCellComponent implements OnInit {
    @Input() texts!: string[];
    @Input() backgroundColor: string;
    @Input() routePath: string;

    constructor() {
    }

    ngOnInit(): void {
    }

}
