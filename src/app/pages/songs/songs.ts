import { AuthService } from './../../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FeedbackController } from '../../feedback.controller';
import { SongeditPage } from './../songedit/songedit';
import { SongviewPage } from './../songview/songview';
import { DataService, Song } from '../../data.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';


@Component({
  selector: 'page-songs',
  templateUrl: 'songs.html',
  styleUrls: [ "songs.scss" ]

})
export class SongsPage {

  public songs: Observable<Song[]>

  constructor(private authService: AuthService, public dataService: DataService) {}

  async ngOnInit() {
    console.log('onInit SongsPage');
    this.songs = this.dataService.findAllSongs();

    this.authService.loginState.subscribe((user) => {
      this.songs = this.dataService.findAllSongs();
    });
  }





}
