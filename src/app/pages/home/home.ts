import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from '../../auth.service';

import { DataService } from '../../data.service';

import * as fileSaver from 'file-saver';
import { FeedbackController } from '../../feedback.controller';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  @ViewChild('fileInp') fileInput: ElementRef;
  @ViewChild('fileHtmlInp') fileHtmlInput: ElementRef;

  constructor(public authService: AuthService, private dataService: DataService,
      private alertCtrl: AlertController, private loadingCtrl: LoadingController, private feedbackCtrl: FeedbackController) {
  }

  async yamlImport(e) {
    const loading = await this.loadingCtrl.create({
      message: 'Importing songs...'
    });
    await loading.present();

    const fileList: FileList = e.target.files;
    try {
      const count = await this.dataService.importSongs(fileList[0]);
      this.feedbackCtrl.successFeedback(count + ' Songs successfully imported.');
    } catch (error) {
      this.feedbackCtrl.errorFeedback('Song import failed', error);
    } finally {
      await loading.dismiss();
    }
  }

  onYamlImport(e) {
    this.yamlImport(e).catch(reason => this.feedbackCtrl.errorFeedback('error on yaml import.', reason));
  }

  onYamlImportClick() {
    this.fileInput.nativeElement.click();
  }

  async htmlImport(e) {
    const fileList: FileList = e.target.files;
    const loading = await this.loadingCtrl.create({
      message: 'Removing songs...'
    });
    await loading.present();
    try {
      const count = await this.dataService.importSongsFromHtml(fileList[0]);
      this.feedbackCtrl.successFeedback(count + ' songs successfully importet');
    } catch (error) {
      this.feedbackCtrl.errorFeedback('import failed', error);
    } finally {
      await loading.dismiss();
    }
  }
  onHtmlImportClick() {
    this.fileHtmlInput.nativeElement.click();
  }

  onHtmlImport(e) {
    this.htmlImport(e).catch(reason => this.feedbackCtrl.errorFeedback('error on html import.', reason));
  }

  async exportSongs() {
    try {
      const data = await this.dataService.exportSongs();
      const file = new Blob([ data ], { type: 'text/yaml;charset=utf-8' });
      fileSaver.saveAs(file, 'songs.yaml');
      this.feedbackCtrl.successFeedback('Songs exported.');
    } catch (error) {
      this.feedbackCtrl.errorFeedback('Song export failed', error);
    }
  }

  onExportSongs() {
    this.exportSongs().catch((reason) => this.feedbackCtrl.errorFeedback('error on song export.', reason));
  }

  async showRemoveSongsConfirm(event) {
    event.stopPropagation();
    const confirm = await this.alertCtrl.create({
      header: 'Remove all Songs',
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
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'Removing songs...'
            });
            await loading.present();

            try {
              const count = await this.dataService.removeAllSongs();
              this.feedbackCtrl.successFeedback(count + ' Songs removed.');
            } catch (error) {
              this.feedbackCtrl.errorFeedback('Failed to remove all songs', error);
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });
    await confirm.present();
  }

  onShowRemoveSongsConfirm(event) {
    this.showRemoveSongsConfirm(event).catch((reason) => this.feedbackCtrl.errorFeedback(
        'error on show remove all: ', reason));
  }

}
