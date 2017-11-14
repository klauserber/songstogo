import { Song, StgUser } from './data.service';
import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
//import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase/app';
//import { PapaParseService, PapaParseConfig } from 'ngx-papaparse';

import * as moment from 'moment';

import * as jsyaml from 'js-yaml';


export interface StgUser {
  id: string;
  name: string;
  providerId: string;
}

export interface Song {
  id: string;
  title: string;
  text: string;
  artist: string;
  key: string;
  tempo: number;
  length: number;
}

@Injectable()
export class DataService {
  songsList: Song[];

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
      this.songsList = null;
      this.songsCollection = null;
    }

  }

  initSongsCollection() {
    this.songsCollection = this.userDoc.collection<Song>("/songs", ref => ref.orderBy("title"));

    this.songsCollection.valueChanges().subscribe((songs) => {
      this.songsList = songs;
    });
  }

  saveSong(song: Song) {
    if(song.id === undefined || song.id === null) {
      song.id = this.afs.createId();
    }
    this.songsCollection.doc(song.id).set(song);
  }

  removeSong(id: string) {
    this.songsCollection.doc(id).delete();
  }

  removeAllSongs() {
    this.afs.firestore.runTransaction((trans) => {
      return new Promise((resolve, reject) => {
        this.songsList.forEach((song) => {
          trans.delete(this.songsCollection.doc(song.id).ref);
        });
      });
    });
  }

  importSongs(file: File) {

    console.log(file);
    let reader = new FileReader();

    reader.onloadend = (e) => {
      let count = 0;
      let data = jsyaml.safeLoad(reader.result) as Song[];
      for(let i=0; i < data.length; i++) {
        let song = data[i];
        this.saveSong(song);
        count++;
      }
      console.log(count + " songs imported")
    };
    reader.readAsText(file);
  }

  exportSongs() : Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(jsyaml.safeDump(this.songsList));
    });
  }

  importSongsFromHtml(file: File) {
    let parser = new DOMParser();

    let reader = new FileReader();

    reader.onloadend = (e) => {
      let doc = parser.parseFromString(reader.result, "text/html");
      console.log(doc);
      this.imoprtSongsFromDoc(doc);
    };
    reader.readAsText(file);

  }

  /*
  cells:
       0 Name
       1 GenreName
       2 ArtistName
       3 Key
       4 Notes
       5 Lyrics
       6 Tempo
       7 SongLength
       8 Other
  */
  imoprtSongsFromDoc(doc: Document) : number {
    let rows = doc.getElementsByTagName("tr");

    let count = 0;

    for(let r=0; r<rows.length; r++) {
      let row = rows[r];
      //console.log("row " + r);
      let cells = row.cells;
      //console.log(moment.duration("03:32").asSeconds());

      let song = {
        title: cells[0].innerHTML,
        artist: cells[2].innerHTML,
        key: cells[3].innerHTML,
        text: cells[5].innerHTML,
        tempo: Number.parseInt(cells[6].innerHTML),
        length: moment.duration("00:" + cells[7].innerHTML).asSeconds(),
      } as Song;

      console.log(song);
      this.saveSong(song);
      count++;
    }
    return count;

  }

}
