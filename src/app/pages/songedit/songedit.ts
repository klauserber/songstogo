import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Song, DataService } from './../../data.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { FeedbackController } from '../../feedback.controller';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

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

  constructor(private navController: NavController, private route: ActivatedRoute, private dataService: DataService, private feedbackCtrl: FeedbackController) {}

  ngOnInit() {
    this.route.paramMap.pipe(switchMap((params: ParamMap) => { 
      let songId = params.get("id");
      if(songId != undefined) {
        return this.dataService.findSongById(songId) 
      }
      else {
        return of({ title: "New Song", text: "Song text" } as Song);
      }
    })).subscribe((song) => this.song = song);
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
