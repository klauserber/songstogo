import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';

import { AuthService } from '../../app/auth.service';

import { DataService } from '../../app/data.service';

import * as fileSaver from 'file-saver';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  @ViewChild('fileInp') fileInput: ElementRef;
  @ViewChild('fileHtmlInp') fileHtmlInput: ElementRef;

  constructor(public navCtrl: NavController, public authService: AuthService, private dataService: DataService,
      private alertCtrl: AlertController, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
  }

  onYamlImport(e) {
    let loading = this.loadingCtrl.create({
      content: 'Importing songs...'
    });          
    loading.present();            
    let fileList: FileList = e.target.files;
    this.dataService.importSongs(fileList[0]).then((count) => {
      loading.dismiss();            
      let toast = this.toastCtrl.create({
        message: count + ' Songs successfully imported.',
        duration: 3000,
        cssClass: 'success',
        position: 'top'
      });
      toast.present();
    }).catch((err) => {
      loading.dismiss();            
      let msg = "Songimport failed";
      console.log(msg, err);
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        cssClass: 'error',
        position: 'top'
      });  
      toast.present();      
    });
  }

  onYamlImportClick() {
    this.fileInput.nativeElement.click();
  }

  onHtmlImport(e) {
    let fileList: FileList = e.target.files;
    this.dataService.importSongsFromHtml(fileList[0]);
  }
  onHtmlImportClick() {
    this.fileHtmlInput.nativeElement.click();
  }

  exportSongs() {
    this.dataService.exportSongs().then( (data) => {
      let file = new Blob([ data ], { type: 'text/yaml;charset=utf-8' });
      fileSaver.saveAs(file, "songs.yaml");
      let toast = this.toastCtrl.create({
        message: 'Songs exported.',
        duration: 3000,
        cssClass: 'success',
        position: 'top'
      });  
      toast.present();
    }).catch((err) => {
      let msg = "Songexport failed";
      console.log(msg, err);
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        cssClass: 'error',
        position: 'top'
      });  
      toast.present();      
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
              let toast = this.toastCtrl.create({
                message: count + ' Songs removed.',
                duration: 3000,
                cssClass: 'success',
                position: 'top'
              });  
              toast.present();
            }).catch((err) => {
              let msg = "Failed to remove all songs";
              console.log(msg, err);
              let toast = this.toastCtrl.create({
                message: msg,
                duration: 3000,
                cssClass: 'error',
                position: 'top'
              });  
              toast.present();      
        
            });
          }
        }
      ]
    });
    confirm.present();
  }

}
