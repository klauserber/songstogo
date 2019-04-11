import { AuthService } from '../../auth.service';
import { switchMap } from 'rxjs/operators';
import { SetListEntryType, SetListService, SetListEntryModel } from '../../setlist.service';
import { Observable, of } from 'rxjs';
import { FeedbackController } from '../../feedback.controller';
import { SetList, DataService, Song } from '../../data.service';
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'page-setListedit',
  templateUrl: 'setlistedit.html',
  styleUrls: [ 'setlistedit.scss' ]
})
export class SetListeditPage implements OnInit {

  addMode = false;
  setList: SetList;
  entries: SetListEntryModel[] = [];
  songs: Observable<Song[]>;
  selectedIndex: number = undefined;


  constructor(private authService: AuthService, public router: Router, public route: ActivatedRoute, private navController: NavController,
      private dataService: DataService, private setListService: SetListService,
      private FeedbackCtrl: FeedbackController) {

        this.setList = SetListService.getEmpty();

  }

  ngOnInit() {
    this.initLists();
    this.authService.loginState.subscribe(() => this.initLists());
  }

  initLists() {
    this.songs = this.dataService.findAllSongs();

    this.route.paramMap.pipe(switchMap((params: ParamMap) => of(params.get('id')))).subscribe((id) => {

      if (id !== undefined) {
        this.dataService.findSetListById(id).subscribe((setList) => {
          this.setList = setList;
          if (this.setList !== undefined) {
            this.entries = this.setListService.createEntriesModel(this.setList.setListEntries);
          }
        });
      } else {
        this.setList = SetListService.getEmpty();
      }
    });
  }

  async setListSaveTapped() {
    try {
      this.setList.setListEntries = this.setListService.createSetListEntries(this.entries);
      this.dataService.saveSetList(this.setList).then(() => {
        this.FeedbackCtrl.successFeedback('Seltlist saved: ' + this.setList.title);
      });
    } catch (error) {
      this.FeedbackCtrl.errorFeedback('Seltlist save error', error);
    }
    this.navController.back();
  }

  onSetListSaveTapped() {
    this.setListSaveTapped().catch( reason => this.FeedbackCtrl.errorFeedback('error on setlist save.', reason));
  }

  deleteAll() {
    this.entries = [];
  }

  entryTapped(event, entry: SetListEntryModel, index: number) {
    this.selectedIndex = (index === this.selectedIndex) ? undefined : index;
  }

  addModeOn() {
    this.addMode = true;
  }

  addModeOff() {
    this.addMode = false;
  }

  isSongAdded(songid) {
    return SetListService.isSongInSetList(this.entries, songid);
  }

  songTapped(event, song: Song) {
    event.stopPropagation();
    const idx = this.selectedIndex !== undefined ? this.selectedIndex : this.entries.length;
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

  dropUpVisible(index: number): boolean {
    return index > 0 && (this.selectedIndex === undefined || index > this.selectedIndex);
  }
  dropDownVisible(index: number): boolean {
    return (index + 1) < this.entries.length && (this.selectedIndex === undefined || index < this.selectedIndex);
  }

  entryMoveTapped(event, entry: SetListEntryModel, index: number, upDown: string) {
    event.stopPropagation();
    this.entries.splice(index, 1);

    if (this.selectedIndex === undefined) {
      this.selectedIndex = upDown === 'up' ? index - 1 : index + 1;
    }

    this.entries.splice(this.selectedIndex, 0, entry);

    this.entries = this.setListService.reNumber(this.entries);

    if (this.selectedIndex < this.entries.length - 1) { this.selectedIndex++; }
  }

}
