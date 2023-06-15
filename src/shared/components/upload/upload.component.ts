import { FileService } from './../../../services/file.service';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppInitService } from 'services/app-init.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  progress: number;
  message: string;
  url:any;
  isHasAvater:boolean=true;
  fileImageUrl:string;
  @Output() public onUploadFinished = new EventEmitter();
  @Input() item:string;
  @Input() isDefaultImage:boolean=true;
  constructor(private fileService: FileService,private config: AppInitService ) {
    this.fileImageUrl=environment.baseUrlMedia;// this.config.baseUrl.imgUrl;

  }

  ngOnInit() {
    setTimeout (() => {
      // console.log(this.item);
      this.url = this.fileImageUrl+this.item;
   }, 500);


  }

  uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.fileService.upload(formData)
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round(100 * event.loaded / event.total);
          else if (event.type === HttpEventType.Response) {
            this.url =this.fileImageUrl+"Resources/Images/"+ fileToUpload.name;
            this.onUploadFinished.emit(event.body);
            this.isDefaultImage=true;
          }
        },
        error: (err: HttpErrorResponse) => console.log(err)
      });
  }

  public delete(){
    this.isHasAvater=false;
    this.isDefaultImage=false;
    this.url = this.fileImageUrl+"Resources/Images/user.png";
  }
}
