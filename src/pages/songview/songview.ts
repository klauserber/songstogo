import { Song } from './../../app/songs.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SongviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-songview',
  templateUrl: 'songview.html',
})
export class SongviewPage {

  public song: Song;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.song = navParams.get("song");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SongviewPage');
  }

}
