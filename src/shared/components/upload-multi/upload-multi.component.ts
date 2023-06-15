import { forEach, remove } from 'lodash-es';
import { FileInfo } from './../../models/fileInfo';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileService } from 'services/file.service';
import * as uuid from 'uuid';
import { ThisReceiver } from '@angular/compiler';
import { Media } from '@shared/service-proxies/service-proxies';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-upload-multi',
  templateUrl: './upload-multi.component.html',
  styleUrls: ['./upload-multi.component.css']
})
export class UploadMultiComponent implements OnInit {
  progress: number;
  message: string;
  res:any;
  fileInfos:FileInfo[] =[];
  @Output() public onUploadFinished = new EventEmitter();
 @Input() items:Media[];
 fileNumber: number[];
 @Input() maxlength: number = 1;
 fileItems: FileInfo[] = [];
  constructor(private fileService: FileService ,private http: HttpClient) { }
  // ngOnInit() {
  //   this.initImageList();
  // }

  // initImageList(): void {
  //   this.fileNumber = Array(this.maxlength).fill(Number).map((x, i) => i);
  //   this.fileItems = [];
  //   for (let i = 0; i < this.maxlength; i++) {
  //     let item = new FileInfo();
  //     item.id = i;
  //     this.fileItems.push(item);
  //   }
  // }

  // onLoadImage(fileLoads: FileInfo[], edit?: boolean): void {
  //   edit = true;
  //   this.initImageList();
  //   if (fileLoads && fileLoads.length > 0) {
  //     fileLoads.forEach((img, index) => {
  //       let url = environment.baseUrlMedia;
  //       let temptfile = new FileInfo();
  //       temptfile.id = img.id;
  //       temptfile.pathFile = url + img.pathFile;
  //       temptfile.fileName = img.fileName;
  //       if (edit) {
  //         fetch(url + img.pathFile)
  //           .then((e) => {
  //             return e.blob()
  //           })
  //           .then((blob) => {
  //             this.fileItems[index] = temptfile;
  //           });
  //       }
  //       else {
  //         this.fileItems[index] = temptfile;
  //       }
  //       //temptfile.content = files[i];

  //     });
  //   }
  // }
  ngOnInit() {
    console.log(this.items)
    if(this.items !=undefined)
    {
        this.items.forEach(rs=>{
          let f=new FileInfo();
          f.pathFile=rs.url;
          this.fileInfos.push(f);
        })
    }
  }

  uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let filesToUpload : File[] = files;
    const formData = new FormData();

    Array.from(filesToUpload).map((file, index) => {
      return formData.append('file'+index, file, file.name);
    });
    this.fileService.uploadMulti(formData).toPromise().then(rs=>{
      this.res=rs;
      if(rs!=null)
      {
        this.res.body.forEach(r=>{
          this.fileInfos.push(r);
        });
        this.onUploadFinished.emit(this.fileInfos);
      }
      },
      err=>{
        // console.log(err)
      }
    );

  }
  deleteFile(item:any){
      this.fileInfos.splice(this.fileInfos.indexOf(item), 1);
  }




  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001${serverPath}`;
  }
}
