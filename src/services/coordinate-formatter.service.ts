import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CoordinateFormatterService {
  sX:any;
  sY:any;
  constructor(private decimalPipe: DecimalPipe) {
  }
// @ts-ignore
  numberCoordinates(
    coordinates: number[],
    fractionDigits: number = 0,
    template?: string,
  ) {
    template = template || '{x} {y}';

    const x = coordinates[0];
    const y = coordinates[1];
    const digitsInfo = `1.${fractionDigits}-${fractionDigits}`;
   this.sX =this.decimalPipe.transform(x, digitsInfo);
    this.sY = this.decimalPipe.transform(y, digitsInfo);
    return template.replace('{x}', this.sX).replace('{y}', this.sY);
  }
}
