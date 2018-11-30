import { SetListEntry, SetList, DataService, Song } from './data.service';
import { Injectable } from '@angular/core';

export enum SetListEntryType {
  SONG,
  PAUSE
}

export interface SetListEntryModel {
  songNumber: number;
  title: string;
  entryType: SetListEntryType;
  song: Song;
}

@Injectable()
export class SetListService {

  constructor(private dataService: DataService) {}

  static getEmpty() {
    return {
      id: null,
      date: Date.now(),
      title: '',
      setListEntries: []
    } as SetList;
  }

  static isSongInSetList(entriesModel: SetListEntryModel[], songId: string) {
      for (let i = 0; i < entriesModel.length; i++) {
          if (entriesModel[i].song.id === songId) {
              return true;
          }
      }
      return false;
  }

  createSetListEntries(entriesModel: SetListEntryModel[]) {
    const setListEntries: SetListEntry[] = [];
    entriesModel.forEach((entry) => {
      switch (entry.entryType) {
        case SetListEntryType.SONG:
          setListEntries.push({
            pauseTitle: null,
            songId: entry.song.id
          });
        break;
        case SetListEntryType.PAUSE:
          setListEntries.push({
            pauseTitle: entry.title,
            songId: null
          });
        break;
      }
    });
    return setListEntries;
  }

  createEntriesModel(entries: SetListEntry[]) {
    const entriesModel: SetListEntryModel[] = [];
    if (entries === undefined) {
      return entriesModel;
    }
    console.log('create ' + entries.length);
    for (const entry of entries) {
      let entryType: SetListEntryType;
      let title: string;
      let song: Song;
      console.log(entry.songId + ' found');

      if (entry.songId !== null) {
        entryType = SetListEntryType.SONG;
        song = this.dataService.getSongsMap().get(entry.songId);
        title = (song) ? song.title : null;
      }
      // let type = entry.songId != null ? SetListEntryType.SONG : SetListEntryType.PAUSE;
      entriesModel.push({
        song: song,
        songNumber: 0,
        title: title,
        entryType: entryType
      });
    }
    return this.reNumber(entriesModel);

  }

  reNumber(entriesModel: SetListEntryModel[]) {

    let numb = 1;
    entriesModel.forEach((entry) => {
      if (SetListEntryType.SONG === entry.entryType) {
        entry.songNumber = numb++;
      }
    });

    return entriesModel;
  }

}

