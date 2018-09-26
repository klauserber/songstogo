import { switchMap } from 'rxjs/operators';
import { SetListEntryType, SetListService, SetListEntryModel } from './../../setlist.service';
import { Observable } from 'rxjs';
import { FeedbackController } from './../../feedback.controller';
import { SetList, DataService, Song } from './../../data.service';
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'page-setListedit',
  templateUrl: 'setlistedit.html',
})
export class SetListeditPage implements OnInit{

  setList: SetList;
  songs: Observable<Song[]>;
  entries: SetListEntryModel[] = [];
  selectedIndex: number = undefined;
  

  constructor(public router: Router, public route: ActivatedRoute, private navController: NavController,
      private dataService : DataService, private setListService: SetListService,
      private FeedbackCtrl: FeedbackController) {
    
  }

  async ngOnInit() {
    this.route.paramMap.pipe(switchMap((params: ParamMap) => { 
      let setlistId = params.get('id');
      if(setlistId === undefined) {
        return this.setListService.getEmpty();
      }
      else {
        return this.dataService.findSetListById(setlistId)
      }
    }
    )).subscribe((setList) => {
      this.setList = setList;
      if(this.setList !== undefined) {
        this.entries = this.setListService.createEntriesModel(this.setList.setListEntries);
      }  
    });    

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
    this.navController.goBack();
  }

  deleteAll() {
    this.entries = [];
  }  

  entryTapped(event, entry: SetListEntryModel, index: number) {
    this.selectedIndex = (index === this.selectedIndex) ? undefined : index;
  }

  songTapped(event, song: Song) {
    event.stopPropagation();
    let idx = this.selectedIndex !== undefined ? this.selectedIndex : this.entries.length;
    this.entries.splice(idx, 0, {
      title: song.title,
      songNumber: 0,
      song: song,
      entryType: SetListEntryType.SONG
    });
    this.entries = this.setListService.reNumber(this.entries);
  }
  
  entryRemoveTapped(event, entry: SetListEntryModel, index: number) {
    this.entries.splice(index, 1);
    this.entries = this.setListService.reNumber(this.entries);
    this.selectedIndex = undefined;
  }

  dropUpVisible(index: number) : boolean {
    return index > 0 && (this.selectedIndex === undefined || index > this.selectedIndex);
  }
  dropDownVisible(index: number) : boolean {
    return (index + 1) < this.entries.length && (this.selectedIndex === undefined || index < this.selectedIndex);
  }

  entryMoveTapped(event, entry: SetListEntryModel, index: number, upDown: string) {
    event.stopPropagation();
    this.entries.splice(index, 1);

    if(this.selectedIndex === undefined) {
      this.selectedIndex = upDown === "up" ? index - 1 : index + 1;
    }

    this.entries.splice(this.selectedIndex, 0, entry);

    this.entries = this.setListService.reNumber(this.entries);

    if(this.selectedIndex < this.entries.length - 1) this.selectedIndex++;
  }

}
