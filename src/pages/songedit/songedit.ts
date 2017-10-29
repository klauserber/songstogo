import { Song, DataService } from './../../app/data.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SongeditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-songedit',
  templateUrl: 'songedit.html',
})
export class SongeditPage {

  public song: Song;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private data: DataService) {
    this.song = navParams.get("song");
    console.log(this.song);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SongeditPage');
  }
  
  songSaveTapped(event) {
    this.data.saveSong(this.song);
  }
}
