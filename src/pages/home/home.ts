import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';

import { AuthService } from '../../app/auth.service';

import { DataService } from '../../app/data.service';

import * as fileSaver from 'file-saver';
import { FeedbackController } from '../../app/feedback.controller';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  @ViewChild('fileInp') fileInput: ElementRef;
  @ViewChild('fileHtmlInp') fileHtmlInput: ElementRef;

  constructor(public navCtrl: NavController, public authService: AuthService, private dataService: DataService,
      private alertCtrl: AlertController, private loadingCtrl: LoadingController, private feedbackCtrl: FeedbackController) {
  }

  async onYamlImport(e) {
    let loading = this.loadingCtrl.create({
      content: 'Importing songs...'
    });
    loading.present();

    let fileList: FileList = e.target.files;
    try {
      let count = await this.dataService.importSongs(fileList[0]);
      this.feedbackCtrl.successFeedback(count + ' Songs successfully imported.');
    } catch (error) {
      this.feedbackCtrl.errorFeedback("Songimport failed", error);
    } finally {
      loading.dismiss();
    }
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
      this.feedbackCtrl.successFeedback('Songs exported.');
    }).catch((err) => {
      this.feedbackCtrl.errorFeedback("Songexport failed", err);
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
              this.feedbackCtrl.successFeedback(count + ' Songs removed.');
            }).catch((err) => {
              loading.dismiss();
              this.feedbackCtrl.errorFeedback("Failed to remove all songs", err);
            });
          }
        }
      ]
    });
    confirm.present();
  }

}
