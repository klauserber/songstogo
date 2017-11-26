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
  setListEntries: SetListEntry[];
}
export interface SetListEntry {
  songId: string;
  pauseTitle: string;
}

@Injectable()
export class DataService {
  setLists: SetList[];
  songs: Song[];
  songsMap: Map<string, Song> = null;

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
      this.songsMap = null;
    });
  }

  initSetListsCollection() {
    this.setListsCollection = this.userDoc.collection<SetList>("/setlists", ref => ref.orderBy("date", "desc"));

    this.setListsCollection.valueChanges().subscribe((setLists) => {
      this.setLists = setLists;
    });
  }

  getSongsMap() {
    if(this.songsMap === null) {
      this.songsMap = new Map();
      this.songs.forEach((song) => {
        this.songsMap.set(song.id, song);
      });
    }
    return this.songsMap;
  }

  async saveSong(song: Song) {
    if(song.id === undefined || song.id === null) {
      song.id = this.afs.createId();
    }
    return this.songsCollection.doc(song.id).set(song);

    // Test Errors ...
    //return new Promise((res, rej) => rej("just failed"));
    //throw new Error("failed!");
  }

  async saveSetList(setList: SetList) {
    if(setList.id === undefined || setList.id === null) {
      setList.id = this.afs.createId();
    }
    return this.setListsCollection.doc(setList.id).set(setList);
  }

  async removeSong(id: string) {
    return this.songsCollection.doc(id).delete();
  }

  async removeSetList(id: string) {
    return this.setListsCollection.doc(id).delete();
  }

  findSongById(id: string) {
    return this.songsCollection.doc(id).valueChanges() as Observable<Song>;
  }

  findSetListById(id: string) {
    return this.setListsCollection.doc(id).valueChanges() as Observable<SetList>;
  }

  async removeAllSongs() {
    let batch = this.afs.firestore.batch();
    let count = this.songs.length;

    this.songs.forEach((song) => {
      batch.delete(this.songsCollection.doc(song.id).ref);
    });

    // Commit the batch
    await batch.commit();
    console.log("batch committed, " + count + " songs removed");
    return count;
  }

  async removeAllSetLists() {
    let batch = this.afs.firestore.batch();
    let count = this.setLists.length;

    this.setLists.forEach((setList) => {
      batch.delete(this.songsCollection.doc(setList.id).ref);
    });

    // Commit the batch
    await batch.commit();
    console.log("batch committed, " + count + " setLists remved");
    return count;
  }


  async importSongs(file: File) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        let data = jsyaml.safeLoad(reader.result) as Song[];
        let savePromisses = [];
        for(let i=0; i < data.length; i++) {
          let song = data[i];
          savePromisses.push(this.saveSong(song));
        }
        Promise.all(savePromisses).then(() => {
          resolve(savePromisses.length);
        }).catch((err) => {
          reject(err);
        });
      };
      reader.readAsText(file);
    });

  }

  async exportSongs() {
    return jsyaml.safeDump(this.songs);
  }

  /*
  Import from SetListhelper HTML-Format
  */
  async importSongsFromHtml(file: File) {
    return new Promise((resolve, reject) => {
      let parser = new DOMParser();

          let reader = new FileReader();

          reader.onloadend = async (e) => {
            let doc = parser.parseFromString(reader.result, "text/html");
            console.log(doc);
            let count = await this.imoprtSongsFromDoc(doc);
            resolve(count);
          };
          reader.readAsText(file);
    });

  }

  /*
  Import from SetListhelper HTML-Format

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
  async imoprtSongsFromDoc(doc: Document) {
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
      await this.saveSong(song);
      count++;
    }
    return count;

  }

}
