import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Song, DataService } from './../../data.service';
import { Component } from '@angular/core';
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


  constructor(private route: ActivatedRoute, private dataService: DataService) {}

  async initSong() {
    
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => 
        this.dataService.findSongById(params.get('id'))
      )
    ).subscribe((song) => this.song = song);    
    
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SongviewPage');
  }

}
