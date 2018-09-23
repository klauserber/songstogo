import { Song, DataService } from './../../app/data.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { SongeditPage } from '../songedit/songedit';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

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
export class SongviewPage implements OnInit {

  public song: Song;

  ngOnInit(): void {
    this.initSong();
  }


  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService) {

  }

  async initSong() {
    let id = this.navParams.get("songid");
    let songOb = await this.dataService.findSongById(id);

    songOb.subscribe((song) => {
      this.song = song;
    });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SongviewPage');
  }

  songEditTapped(event) {
    this.navCtrl.push(SongeditPage, {
      song: this.song
    });
  }
}
