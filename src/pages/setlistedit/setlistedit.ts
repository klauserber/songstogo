import { SetListEntryType, SetListService } from './../../app/setlist.service';
import { Observable } from 'rxjs/Observable';
import { FeedbackController } from './../../app/feedback.controller';
import { SetList, DataService, Song } from './../../app/data.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SetListEntryModel } from '../../app/setlist.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'page-setListedit',
  templateUrl: 'setListedit.html',
})
export class SetListeditPage implements OnInit{

  setList: SetList;
  songs: Observable<Song[]>;
  selectedEntry: number = null;
  entries: SetListEntryModel[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
      private dataService : DataService, private setListService: SetListService,
      private FeedbackCtrl: FeedbackController) {
    let setList = navParams.get("setList");
    this.setList = setList !== undefined ? setList : setListService.getEmpty();
  }

  async ngOnInit() {
    this.setList = this.navParams.get("setList");
    if(this.setList !== undefined) {
      this.entries = await this.setListService.createEntriesModel(this.setList.setListEntries);
      console.log(this.entries.length + " entries");
    }
    else {
      this.setList = this.setListService.getEmpty();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetListeditPage');
  }

  async setListSaveTapped(event) {
    try {
      this.setList.setListEntries = this.setListService.createSetListEntries(this.entries);
      await this.dataService.saveSetList(this.setList);
      this.FeedbackCtrl.successFeedback("Seltlist saved");
    } catch (error) {
      this.FeedbackCtrl.errorFeedback("Seltlist save error", error);
    }
    this.navCtrl.pop();
  }

  deleteAll() {
    this.entries = [];
  }  

  songTapped(event, song: Song) {
    console.log("Song tapped: " + song.title);
    this.entries.push({
      title: song.title,
      songNumber: 0,
      songId: song.id,
      entryType: SetListEntryType.SONG
    });
  }
  
}
