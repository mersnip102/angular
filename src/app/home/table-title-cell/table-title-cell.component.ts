import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-home-table-title-cell',
    templateUrl: './table-title-cell.component.html',
    styleUrls: ['./table-title-cell.component.css']
})
export class TableTitleCellComponent implements OnInit {
    @Input() title: string;
    @Input() image: string;
    @Input() textColor: string;

    constructor() {
    }

    ngOnInit(): void {
    }

}
