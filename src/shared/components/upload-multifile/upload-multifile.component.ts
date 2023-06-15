import { AppComponentBase } from '@shared/app-component-base';
import { MediaServiceServiceProxy } from './../../service-proxies/service-proxies';
import { forEach, remove } from 'lodash-es';
import { FileInfo } from './../../models/fileInfo';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FileService } from 'services/file.service';
import * as uuid from 'uuid';
import { ThisReceiver } from '@angular/compiler';
import { Media, ConfigServiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { environment } from 'environments/environment';
import { Const } from '@shared/constant/constant';

@Component({
  selector: 'app-upload-multifile',
  templateUrl: './upload-multifile.component.html',
  styleUrls: ['./upload-multifile.component.css']
})



export class UploadMultifileComponent extends AppComponentBase implements OnInit {
  progress: number;
  res:any;
  fileInfos:FileInfo[] =[];
  @Output() public onUploadFinishedFile = new EventEmitter();
 @Input() items:Media[];
 fileNumber: number[];
 @Input() maxlength: number = 1;
 fileItems: FileInfo[] = [];
 url:any;
 max_upload_file:string;

  constructor(injector: Injector,private fileService: FileService ,
    private http: HttpClient,
    private mediaService:MediaServiceServiceProxy,
    private configService:ConfigServiceServiceProxy
    ) {
      super(injector);
    this.url = environment.baseUrlMedia;
   }
  ngOnInit() {
    this.configService.getValueByKey("MAX_UPLOAD_FILE").subscribe(rs=>{
      this.max_upload_file=rs!=null?rs:Const.max_upload_file;
    })
  }

  initImageList(): void {
    this.fileNumber = Array(this.maxlength).fill(Number).map((x, i) => i);
    this.fileItems = [];
    for (let i = 0; i < this.maxlength; i++) {
      let item = new FileInfo();
      item.id = i;
      this.fileItems.push(item);
    }
  }

  onLoadFile(fileLoads: Media[], edit?: boolean): void {
    edit = true;
    //this.initImageList();
    if (fileLoads && fileLoads.length > 0) {
      fileLoads.forEach((img, index) => {

        let temptfile = new FileInfo();
        temptfile.id = img.id;
        temptfile.pathFile =img.url;
        temptfile.paknId=img.paknId;
        temptfile.fileName=img.url.split('\\')[2];
        // temptfile.fileName = img.;
        if (edit) {
          fetch(img.url)
            .then((e) => {
              return e.blob()
            })
            .then((blob) => {
              this.fileItems[index] = temptfile;
            });
        }
        else {
          this.fileItems[index] = temptfile;
        }
        //temptfile.content = files[i];

      });
    }
  }

  uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    if(files.length> parseInt(this.max_upload_file))
    {
      this.notify.error("Chỉ được phép upload tối đa "+this.max_upload_file+" file !");
      return;
    }
    let filesToUpload : File[] = files;
    const formData = new FormData();

    Array.from(filesToUpload).map((file, index) => {
      return formData.append('file'+index, file, file.name);
    });
    this.fileService.uploadMulti(formData).toPromise().then(rs=>{
      this.res=rs;
      console.log(this.res);
      if(rs!=null)
      {
        this.res.body.forEach(r=>{
          this.fileInfos.push(r);
          this.fileItems.push(r);
        });
        this.onUploadFinishedFile.emit(this.fileInfos);
      }
      },
      err=>{
        // console.log(err)
      }
    );

  }
  deleteFile(item:any){
      this.fileInfos.splice(this.fileInfos.indexOf(item), 1);
      this.fileItems.splice(this.fileItems.indexOf(item), 1);
      if(this.isNumeric(item.id))
      {
        this.mediaService.delete(item.id).subscribe(rs=>{
        });
      }


  }

isNumeric = (val: string) : boolean => {
    return !isNaN(Number(val));
 }


  public createImgPath = (serverPath: string) => {
    return this.url+ serverPath;
  }
}
