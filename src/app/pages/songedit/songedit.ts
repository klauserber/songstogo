import { AuthService } from './../../auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Song, DataService } from './../../data.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { FeedbackController } from '../../feedback.controller';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'page-songedit',
  templateUrl: 'songedit.html',
  styleUrls: [ "songedit.scss" ]
})
export class SongeditPage {

  public song: Song = this.newSong();

  constructor(private authService: AuthService, private navController: NavController, private route: ActivatedRoute,
    private dataService: DataService, private feedbackCtrl: FeedbackController) {}

  ngOnInit() {
    this.initSong();
    this.authService.loginState.subscribe((user) => this.initSong());
  }
  
  initSong() {
    this.route.paramMap.pipe(switchMap((params: ParamMap) => of(params.get("id")))).subscribe((id) => {
      if(id != undefined) {
        this.dataService.findSongById(id).subscribe((song) => this.song = song);
      }
      else {
        this.song = this.newSong();
      }
    }); 
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
