import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';

import { AuthService } from '../../app/auth.service';

import { DataService } from '../../app/data.service';

import * as fileSaver from 'file-saver';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  @ViewChild('fileInp') fileInput: ElementRef;
  @ViewChild('fileHtmlInp') fileHtmlInput: ElementRef;

  constructor(public navCtrl: NavController, public authService: AuthService, private dataService: DataService,
      private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
  }

  fileChange(e) {
    let fileList: FileList = e.target.files;
    this.dataService.importSongs(fileList[0]);
  }

  onImportClick() {
    this.fileInput.nativeElement.click();
  }

  fileChangeHtml(e) {
    let fileList: FileList = e.target.files;
    this.dataService.importSongsFromHtml(fileList[0]);
  }
  onImportHtmlClick() {
    this.fileHtmlInput.nativeElement.click();
  }

  exportSongs() {
    this.dataService.exportSongs().then( (data) => {
      let file = new Blob([ data ], { type: 'text/yaml;charset=utf-8' });
      fileSaver.saveAs(file, "songs.yaml");
    });
  }

  showRemoveSongsConfirm(event) {
    event.stopPropagation();
    let confirm = this.alertCtrl.create({
      title: "Remove all Songs",
      message: 'Do you want to Remove all songs?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: 'Removing songs...'
            });          
            loading.present();            
          
            this.dataService.removeAllSongs().then((count) => {
              loading.dismiss();
            });
          }
        }
      ]
    });
    confirm.present();
  }

}
