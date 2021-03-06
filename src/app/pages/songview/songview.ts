import { AuthService } from '../../auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Song, DataService } from '../../data.service';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable, of } from 'rxjs';
import { AlertController, NavController } from '@ionic/angular';
import { FeedbackController } from '../../feedback.controller';
import { switchMap } from 'rxjs/operators';

/**
 * Generated class for the SongviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-songview',
  templateUrl: 'songview.html',
  styleUrls: [ 'songview.scss' ]
})
export class SongviewPage implements OnInit {

  public song: Observable<Song>;
  public songData: Song;
  public songEditRoute = '';

  ngOnInit(): void {
    this.initSong();
    this.authService.loginState.subscribe(() => this.initSong());
  }


  constructor(private authService: AuthService, private route: ActivatedRoute, private dataService: DataService,
              private alertCtrl: AlertController, private feedbackCtrl: FeedbackController, private navController: NavController) {}

  initSong() {
    this.route.paramMap.pipe(switchMap((params: ParamMap) => of(params.get('id')))).subscribe((id) => {
      this.findSong(id);
    });
  }

  findSong(id) {
    this.song = this.dataService.findSongById(id);
    this.song.subscribe((song) => {
      this.songEditRoute = '/songedit/' + song.id;
      this.songData = song;
    });
    return this.song;
  }


  async showRemoveConfirm(event) {
    console.log('showRemoveConfirm');
    event.stopPropagation();
    const confirm = await this.alertCtrl.create({
      header: 'Remove Song',
      message: 'Remove "' + this.songData.title + '"?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: async () => {
            try {
              await this.dataService.removeSong(this.songData.id);
              this.feedbackCtrl.successFeedback('Song "' + this.songData.title + '" removed');
              this.navController.back();
            } catch (error) {
              this.feedbackCtrl.errorFeedback('Remove song failed', error);
            }
          }
        }
      ]
    });
    confirm.present();
  }

  onShowRemoveConfirm(event) {
    this.showRemoveConfirm(event).catch(reason => this.feedbackCtrl.errorFeedback(
        'error on show remove.', reason));
  }

}
