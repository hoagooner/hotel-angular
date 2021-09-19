import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { HttpEventType, HttpResponse, } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  @Input() selectedFiles: FileList;
  @Input() currentFile: File;
  progress = 0;
  message = '';

  @Output() onFileSelected = new EventEmitter()

  constructor(private uploadService: UploadFileService) { }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }
  ngOnInit() {
  }


  upload() {
    this.progress = 0;

    this.currentFile = this.selectedFiles.item(0);
    this.uploadService.upload(this.currentFile).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
          //hide progress after success
          setTimeout(() => {
            this.currentFile = undefined
          }, 800);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
        }
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
      });
    // emit output  
    this.onFileSelected.emit(this.currentFile.name)
    this.selectedFiles = undefined;
  }

}