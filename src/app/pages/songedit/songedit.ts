import { AuthService } from '../../auth.service';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { Song, DataService } from '../../data.service';
import {Component, OnInit} from '@angular/core';
import { NavController} from '@ionic/angular';
import { FeedbackController } from '../../feedback.controller';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'page-songedit',
  templateUrl: 'songedit.html',
  styleUrls: [ 'songedit.scss' ]
})
export class SongeditPage implements OnInit {

  public song: Song = SongeditPage.newSong();

  constructor(private authService: AuthService, private navController: NavController, private route: ActivatedRoute,
    private dataService: DataService, private feedbackCtrl: FeedbackController) {}

  static newSong() {
    return { title: 'New Song', text: 'Song text' } as Song;
  }

  ngOnInit() {
    this.initSong();
    this.authService.loginState.subscribe(() => this.initSong());
  }

  initSong() {
    this.route.paramMap.pipe(switchMap((params: ParamMap) => of(params.get('id')))).subscribe((id) => {
      if (id !== undefined) {
        this.dataService.findSongById(id).subscribe((song) => this.song = song);
      } else {
        this.song = SongeditPage.newSong();
      }
    });
  }

  songSave() {
    try {
      this.dataService.saveSong(this.song).then(() => {
        this.feedbackCtrl.successFeedback('Song saved: ' + this.song.title);
      });
      this.navController.back();
    } catch (error) {
      this.feedbackCtrl.errorFeedback('Save error', error);
    }
  }


}
