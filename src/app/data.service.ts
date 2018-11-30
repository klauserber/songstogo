import { Song, StgUser, SetList } from './data.service';
import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';

import * as firebase from 'firebase/app';
// import { PapaParseService, PapaParseConfig } from 'ngx-papaparse';

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
    if (user !== null) {
      this.userDoc =  this.afs.doc<StgUser>('users/' +  user.uid);
      this.stgUser = {
        id: user.uid,
        name: user.displayName,
        providerId: user.providerData[0].providerId
      };

      this.userDoc.set(this.stgUser).catch((reason) => console.log('cannot set user: ' + reason));

      this.initSongsCollection();
      this.initSetListsCollection();
    } else {
      this.userDoc = null;
      this.stgUser = null;
      this.songs = null;
      this.songsCollection = null;
    }

  }

  initSongsCollection() {
    this.songsCollection = this.userDoc.collection<Song>('/songs', ref => ref.orderBy('title'));

    this.songsCollection.valueChanges().subscribe((songs) => {
      this.songs = songs;
      this.songsMap = null;
    });
  }

  findAllSongs(): Observable<Song[]> {
    if (this.userDoc !== undefined) {
      this.songsCollection = this.userDoc.collection<Song>('/songs', ref => ref.orderBy('title'));
      return this.songsCollection.valueChanges();
    } else {
      return of([] as Song[]);
    }
  }

  findAllSetlists(): Observable<SetList[]> {
    if (this.userDoc !== undefined) {
      this.setListsCollection = this.userDoc.collection<SetList>('/setlists', ref => ref.orderBy('date', 'desc'));
      return this.setListsCollection.valueChanges();
    } else {
      return of([] as SetList[]);
    }
  }

  initSetListsCollection() {
    this.setListsCollection = this.userDoc.collection<SetList>('/setlists', ref => ref.orderBy('date', 'desc'));

    this.setListsCollection.valueChanges().subscribe((setLists) => {
      this.setLists = setLists;
    });
  }

  getSongsMap() {
    if (this.songsMap === null) {
      this.songsMap = new Map();
      this.songs.forEach((song) => {
        this.songsMap.set(song.id, song);
      });
    }
    return this.songsMap;
  }

  async saveSong(song: Song) {
    if (song.id === undefined || song.id === null) {
      song.id = this.afs.createId();
    }
    return this.songsCollection.doc(song.id).set(song);

    // Test Errors ...
    // return new Promise((res, rej) => rej("just failed"));
    // throw new Error("failed!");
  }

  async saveSetList(setList: SetList) {
    if (setList.id === undefined || setList.id === null) {
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

  findSongById(id: string): Observable<Song> {
    if (this.songsCollection !== undefined) {
      return this.songsCollection.doc(id).valueChanges() as Observable<Song>;
    } else {
      return of({} as Song);
    }
  }

  findSetListById(id: string) {
    if (this.setListsCollection !== undefined) {
      return this.setListsCollection.doc(id).valueChanges() as Observable<SetList>;
    } else {
      return of({} as SetList);
    }
  }

  async removeAllSongs() {
    const batch = this.afs.firestore.batch();
    const count = this.songs.length;

    this.songs.forEach((song) => {
      batch.delete(this.songsCollection.doc(song.id).ref);
    });

    // Commit the batch
    await batch.commit();
    console.log('batch committed, ' + count + ' songs removed');
    return count;
  }

  /*
  async removeAllSetLists() {
    const batch = this.afs.firestore.batch();
    const count = this.setLists.length;

    this.setLists.forEach((setList) => {
      batch.delete(this.songsCollection.doc(setList.id).ref);
    });

    // Commit the batch
    await batch.commit();
    console.log('batch committed, ' + count + ' setLists remved');
    return count;
  }
  */

  async importSongs(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const data = jsyaml.safeLoad(reader.result) as Song[];
        const savePromises = [];
        for (let i = 0; i < data.length; i++) {
          const song = data[i];
          savePromises.push(this.saveSong(song));
        }
        Promise.all(savePromises).then(() => {
          resolve(savePromises.length);
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
    return new Promise((resolve) => {
      const parser = new DOMParser();

          const reader = new FileReader();

          reader.onloadend = async () => {
            const doc = parser.parseFromString(reader.result.toString(), 'text/html');
            console.log(doc);
            const count = await this.importSongsFromDoc(doc);
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
  async importSongsFromDoc(doc: Document) {
    const rows = doc.getElementsByTagName('tr');

    let count = 0;

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      const cells = row.cells;

      const song = {
        title: cells[0].innerHTML,
        artist: cells[2].innerHTML,
        key: cells[3].innerHTML,
        text: cells[5].innerHTML,
        tempo: Number.parseInt(cells[6].innerHTML, 10),
        length: moment.duration('00:' + cells[7].innerHTML).asSeconds(),
      } as Song;

      console.log(song);
      await this.saveSong(song);
      count++;
    }
    return count;

  }

}
