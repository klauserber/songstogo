import { AuthService } from './../../auth.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Song, DataService } from './../../data.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController, NavParams } from '@ionic/angular';
import { FeedbackController } from '../../feedback.controller';
import { switchMap } from 'rxjs/operators';

/**
 * Generated class for the SongeditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-songedit',
  templateUrl: 'songedit.html',
  styleUrls: [ "songedit.scss" ]
})
export class SongeditPage {

  public song: Song = this.newSong();

  constructor(private authService: AuthService, private navController: NavController, private route: ActivatedRoute, private dataService: DataService, private feedbackCtrl: FeedbackController) {}

  ngOnInit() {
    this.initSong();
    this.authService.loginState.subscribe((user) => this.initSong());
  }
  
  initSong() {
    this.route.paramMap.subscribe(((params: ParamMap) => { 
      let songId = params.get("id");
      if(songId != undefined) {
        this.dataService.findSongById(songId).subscribe((song) => this.song = song);
      }
      else {
        this.song = this.newSong();
      }
    }));
  }

  newSong() {
    return { title: "New Song", text: "Song text" } as Song;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SongeditPage');
  }

  async songSaveTapped(event) {
    try {
      await this.dataService.saveSong(this.song);
      this.feedbackCtrl.successFeedback("Song saved");
      this.navController.goBack();
    }
    catch (error) {
      this.feedbackCtrl.errorFeedback("Save error", error);
    }
  }
}
