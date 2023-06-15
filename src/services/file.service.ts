import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  public url = environment.baseUrlMedia+"api/file";
 // private url: string = 'https://localhost:5001/api/file';

  constructor(private http: HttpClient) { }

  public upload(formData: FormData) {
    return this.http.post(`${this.url}/upload`, formData, {
        reportProgress: true,
        observe: 'events',
    });
  }
  public uploadMulti(formData: FormData) {
    return  this.http.post(`${this.url}/uploadmulti`, formData, {
        reportProgress: true,
        observe: 'events',
    });
  }

  public download(fileUrl: string) {
    return this.http.get(`${this.url}/download?fileUrl=${fileUrl}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    });
  }

  public getPhotos() {
    return this.http.get(`${this.url}/getPhotos`);
  }
}
