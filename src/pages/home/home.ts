import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../app/auth.service';

import { DataService } from '../../app/data.service';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  constructor(public navCtrl: NavController, public authService: AuthService, private dataService: DataService) {
  }

  fileChange(e) {
    let fileList: FileList = e.target.files;
    this.dataService.importSongs(fileList[0]);
  }
  fileChangeHtml(e) {
    let fileList: FileList = e.target.files;
    this.dataService.importSongsFromHtml(fileList[0]);
  }

  exportSongs() {
    this.dataService.exportSongs().then( (data) => {
      console.log("ok");
      console.log(data);
    });
  }

}
