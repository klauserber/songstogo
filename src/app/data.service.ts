import { Song, StgUser, SetList } from './data.service';
import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

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
export interface SetList {
  id: string;
  title: string;
  date: number;
  songids: string[];
}

@Injectable()
export class DataService {
  setLists: SetList[];
  songs: Song[];

  private songsCollection: AngularFirestoreCollection<Song>;
  private setListsCollection: AngularFirestoreCollection<SetList>;
  private userDoc: AngularFirestoreDocument<StgUser>;
  private stgUser: StgUser;

  constructor(private afs: AngularFirestore) {
  }


  initUserDoc(user: firebase.User) {
    if(user !== null) {
      this.userDoc =  this.afs.doc<StgUser>("users/" +  user.uid);
      this.stgUser = {
        id: user.uid,
        name: user.displayName,
        providerId: user.providerData[0].providerId
      };

      this.userDoc.set(this.stgUser);

      this.initSongsCollection();
      this.initSetListsCollection();
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

    this.songsCollection.valueChanges().subscribe((songs) => {
      this.songs = songs;
    });
  }

  initSetListsCollection() {
    this.setListsCollection = this.userDoc.collection<SetList>("/setlists", ref => ref.orderBy("date", "desc"));

    this.setListsCollection.valueChanges().subscribe((setLists) => {
      this.setLists = setLists;
    });
  }

  saveSong(song: Song) {
    if(song.id === undefined || song.id === null) {
      song.id = this.afs.createId();
    }
    this.songsCollection.doc(song.id).set(song);
  }

  saveSetList(setList: SetList) {
    if(setList.id === undefined || setList.id === null) {
      setList.id = this.afs.createId();
    }
    this.setListsCollection.doc(setList.id).set(setList);
  }

  removeSong(id: string) {
    this.songsCollection.doc(id).delete();
  }

  removeSetList(id: string) {
    this.setListsCollection.doc(id).delete();
  }

  findSongById(id: string) {
    return this.songsCollection.doc(id).valueChanges() as Observable<Song>;
  }

  findSetListById(id: string) {
    return this.setListsCollection.doc(id).valueChanges() as Observable<SetList>;
  }


  removeAllSongs() : Promise<number> {
    return new Promise((resolve, reject) => {
      let batch = this.afs.firestore.batch();
        let count = this.songs.length;

        this.songs.forEach((song) => {
          batch.delete(this.songsCollection.doc(song.id).ref);
        });
    
        // Commit the batch
        batch.commit().then(() => {
          console.log("batch committed, " + count + " songs remved");
          resolve(count);
        }).catch((err) => {
          reject(err);
        });    
    });
    
  }

  removeAllSetLists() : Promise<number> {
    return new Promise((resolve, reject) => {
      let batch = this.afs.firestore.batch();
        let count = this.setLists.length;

        this.setLists.forEach((setList) => {
          batch.delete(this.songsCollection.doc(setList.id).ref);
        });
    
        // Commit the batch
        batch.commit().then(() => {
          console.log("batch committed, " + count + " setLists remved");
          resolve(count);
        }).catch((err) => {
          reject(err);
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
      resolve(jsyaml.safeDump(this.songs));
    });
  }

  /*
  Import from Setlisthelper HTML-Format
  */
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
  Import from Setlisthelper HTML-Format

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
      let cells = row.cells;

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
