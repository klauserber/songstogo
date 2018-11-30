import { AuthService } from '../../auth.service';
import { DataService, Song } from '../../data.service';
import {Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs';


@Component({
  selector: 'page-songs',
  templateUrl: 'songs.html',
  styleUrls: [ 'songs.scss' ]

})
export class SongsPage implements OnInit {

  public songs: Observable<Song[]>;

  constructor(private authService: AuthService, public dataService: DataService) {}

  async ngOnInit() {
    console.log('onInit SongsPage');
    this.songs = this.dataService.findAllSongs();

    this.authService.loginState.subscribe(() => {
      this.songs = this.dataService.findAllSongs();
    });
  }





}
