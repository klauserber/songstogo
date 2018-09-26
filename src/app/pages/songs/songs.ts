import { Router, ActivatedRoute } from '@angular/router';
import { FeedbackController } from '../../feedback.controller';
import { SongeditPage } from './../songedit/songedit';
import { SongviewPage } from './../songview/songview';
import { DataService, Song } from '../../data.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'page-songs',
  templateUrl: 'songs.html',
})
export class SongsPage {


  constructor(public dataService: DataService, private alertCtrl: AlertController, private feedbackCtrl: FeedbackController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SongsPage');
  }

  async showRemoveConfirm(event, song: Song) {
    event.stopPropagation();
    const confirm = await this.alertCtrl.create({
      header: "Remove Song",
      message: 'Remove "' + song.title + '"?',
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
            try {
              await this.dataService.removeSong(song.id);
              this.feedbackCtrl.successFeedback('Song "' + song.title + '" removed');
            } catch (error) {
              this.feedbackCtrl.errorFeedback("Remove song failed", error);
            }
          }
        }
      ]
    });
    confirm.present();
  }



}
