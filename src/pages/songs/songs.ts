import { SongeditPage } from './../songedit/songedit';
import { SongviewPage } from './../songview/songview';
import { DataService, Song } from './../../app/data.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SongsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-songs',
  templateUrl: 'songs.html',
})
export class SongsPage {


  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SongsPage');
  }

  songTapped(event, song: Song) {
    this.navCtrl.push(SongviewPage, {
      song: song
    });
  }

  songNewTapped(event) {
    this.navCtrl.push(SongeditPage, {
      song: { title: "foo", text: "foobar" }
    });
  }



}
