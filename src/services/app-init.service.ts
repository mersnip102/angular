import { Injectable } from '@angular/core';;
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
declare var window: any;

@Injectable()
export class AppInitService {
  public baseUrl = {
    imgUrl: "https://localhost:5001/",
  };

  // This is the method you want to call at bootstrap
  // Important: It should return a Promise
  public init() {
    return from(
      fetch('assets/config/configuration.json').then(response => response.json())
    ).pipe(
      map((config) => {
        this.baseUrl = config;
        // console.log( this.baseUrl)
        return config;
      })).toPromise();
  }
}
