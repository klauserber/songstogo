import { AuthService } from './auth.service';
import { Injectable, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase/app';

export interface StgUser {
  id: string;
  name: string;
  providerId: string;
}

export interface Song {
  id: string;
  title: string;
  text: string;
}

@Injectable()
export class DataService implements OnInit {
  songs: Observable<Song[]>;

  private songsCollection: AngularFirestoreCollection<Song>;
  private userDoc: AngularFirestoreDocument<StgUser>;
  
  constructor(private afs: AngularFirestore, private auth: AuthService) {
    
  
    this.songsCollection = afs.collection<Song>("songs");

    this.songs = this.songsCollection.snapshotChanges().map(action => {
      return action.map(a => {
        const data = a.payload.doc.data() as Song;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });

  }

  ngOnInit() {
    this.auth.authState.subscribe(user => {
      this.initUserDoc(user);
    });
  }

  initUserDoc(user: firebase.User) {
    if(this.auth.isAuthenticated()) {
      this.userDoc = this.afs.doc("users/" + user.uid);

      this.userDoc.set({
        id: user.uid,
        name: user.displayName,
        providerId: user.providerData[0].providerId
      });
    }
    else {
      this.userDoc = null;
    }

  }

}
