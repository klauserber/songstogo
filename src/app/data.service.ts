import { Song, StgUser } from './data.service';
import { Injectable } from '@angular/core';

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
export class DataService {
  songs: Observable<Song[]>;

  private songsCollection: AngularFirestoreCollection<Song>;
  private userDoc: AngularFirestoreDocument<StgUser>;
  private stgUser: StgUser;

  constructor(private afs: AngularFirestore) {

}


  initUserDoc(user: firebase.User) {
    if(user !== null) {
      //this.userDoc = this.afs.doc("users/" + user.uid);
      //AngularFireObject<StgUser>;
      this.userDoc =  this.afs.doc<StgUser>("users/" +  user.uid);
      this.stgUser = {
        id: user.uid,
        name: user.displayName,
        providerId: user.providerData[0].providerId
      };

      this.userDoc.set(this.stgUser);

      this.initSongsCollection();
    }
    else {
      this.userDoc = null;
      this.stgUser = null;
      this.songs = null;
      this.songsCollection = null;
    }

  }

  initSongsCollection() {
    this.songsCollection = this.userDoc.collection<Song>("/songs", ref => ref.orderBy("title"));

    this.songs = this.songsCollection.valueChanges();

    /*snapshotChanges().map(action => {
      return action.map(a => {
        const data = a.payload.doc.data() as Song;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    }); */

  }

  saveSong(song: Song) {
    if(song.id === undefined || song.id === null) {
      song.id = this.afs.createId();
      this.songsCollection.doc(song.id).set(song);
    }
    else {
      this.songsCollection.doc(song.id).update(song);
    }
  }

  removeSong(id: string) {
    this.songsCollection.doc(id).delete();
  }

}
