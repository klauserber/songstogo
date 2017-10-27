import { AuthService } from './auth.service';
import { Song } from './songs.service';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';

import { AngularFirestore, AngularFirestoreCollection  } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase/app';

export interface Song {
  id: string;
  title: string;
  text: string;
}

@Injectable()
export class SongsService {
  songs: Observable<Song[]>;

  private songsCollection: AngularFirestoreCollection<Song>;

  constructor(private afs: AngularFirestore, private auth: AuthService) {
    
    auth.authState.subscribe(user => {
      this.loggedIn(user);
    });
    
    this.songsCollection = afs.collection<Song>("songs");

    this.songs = this.songsCollection.snapshotChanges().map(action => {
      return action.map(a => {
        const data = a.payload.doc.data() as Song;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });

  }
  
  loggedIn(user: firebase.User) {
    //this.usersCollection = afs.collection<Song>("songs");
    
  }
}


export class SongClass {

  public id: string;
  public title: string;
  public text: string;

  constructor(title: string, text: string) {
    this.id = UUID.UUID();
    this.title = title;
    this.text = text;
  }



}
