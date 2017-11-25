import { SetListEntry, SetList, DataService, Song } from './data.service';
import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';

export enum SetListEntryType {
  SONG,
  PAUSE
}

export interface SetListEntryModel {
  songNumber: number;
  title: string;
  entryType: SetListEntryType;
  songId: string;
}

@Injectable()
export class SetListService {

  constructor(private dataService: DataService) {}

  getEmpty() {
    return { 
      id: null,
      date: 0,
      title: "",
      setListEntries: []
    } as SetList;
  }

  createSetListEntries(entries: SetListEntryModel[]) {
    let setListEntries : SetListEntry[] = [];
    entries.forEach((entry) => {
      switch(entry.entryType) {
        case SetListEntryType.SONG: 
          setListEntries.push({
            pauseTitle: null,
            songId: entry.songId
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

  async createEntriesModel(entries: SetListEntry[]) {
    let entriesModel: SetListEntryModel[] = [];
    console.log("create " + entries.length);
    for(let entry of entries) {
      let entryType: SetListEntryType;
      let title: string;
      let song: Song;
      console.log(entry.songId + " found");
      
      if(entry.songId !== null) {
        entryType = SetListEntryType.SONG;
        song = await this.dataService.findSongById(entry.songId).take(1).toPromise();
        title = song.title;
      }
      //let type = entry.songId != null ? SetListEntryType.SONG : SetListEntryType.PAUSE;
      entriesModel.push({
        songId: entry.songId,
        songNumber: 0,
        title: title,
        entryType: entryType
      });
    }

    return entriesModel;

  }


}

