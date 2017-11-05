import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../app/auth.service';

import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public uploader: FileUploader = new FileUploader({});

  constructor(public navCtrl: NavController, public authService: AuthService) {
    this.uploader.autoUpload = true;
    this.uploader.onAfterAddingFile = ( fileItem ) => {
      console.log(fileItem.file.name);
      this.uploader.uploadAll();
    };

    this.uploader.onCompleteAll = ( ) => {
      console.log("upload complete");
    };
  }

}
