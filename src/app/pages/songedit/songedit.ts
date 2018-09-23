import { Song, DataService } from './../../app/data.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { FeedbackController } from '../../app/feedback.controller';

/**
 * Generated class for the SongeditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-songedit',
  templateUrl: 'songedit.html',
})
export class SongeditPage {

  public song: Song;

  constructor(public navCtrl: NavController, public navParams: NavParams, private data: DataService,
      private feedbackCtrl: FeedbackController) {
    this.song = navParams.get("song");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SongeditPage');
  }

  async songSaveTapped(event) {
    try {
      await this.data.saveSong(this.song);
      this.feedbackCtrl.successFeedback("Song saved");
      this.navCtrl.pop();
    }
    catch (error) {
      this.feedbackCtrl.errorFeedback("Save error", error);
    }
  }
}
