import { FeedbackController } from './../../app/feedback.controller';
import { SongeditPage } from './../songedit/songedit';
import { SongviewPage } from './../songview/songview';
import { DataService, Song } from './../../app/data.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-songs',
  templateUrl: 'songs.html',
})
export class SongsPage {


  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService, 
    private alertCtrl: AlertController, private feedbackCtrl: FeedbackController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SongsPage');
  }

  songTapped(event, song: Song) {
    this.navCtrl.push(SongviewPage, {
      songid: song.id
    });
  }

  songNewTapped(event) {
    this.navCtrl.push(SongeditPage, {
      song: { title: "foo", text: "foobar" }
    });
  }

  showRemoveConfirm(event, song: Song) {
    event.stopPropagation();
    let confirm = this.alertCtrl.create({
      title: "Remove Song",
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
