import { SetListSliderPage } from './../setlistslider/setlistslider';
import { SetListService, SetListEntryModel } from './../../app/setlist.service';
import { SetListeditPage } from './../setlistedit/setlistedit';
import { DataService, SetList } from './../../app/data.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'page-setListview',
  templateUrl: 'setListview.html',
})
export class SetListviewPage implements OnInit {

  setList: SetList;
  entries: SetListEntryModel[];
  

  ngOnInit(): void {
    this.initSetList();
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService,
      private setListService: SetListService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetListviewPage');
  }

  async initSetList() {
    let id = this.navParams.get("setListid");
    let setList$ = await this.dataService.findSetListById(id);

    setList$.subscribe((setList) => {
      this.setList = setList;
      this.entries = this.setListService.createEntriesModel(setList.setListEntries);
    });
  }

  setListEditTapped(event) {
    this.navCtrl.push(SetListeditPage, {
      setList: this.setList
    });
  }

  entryTapped(event, entry: SetListEntryModel, index: number) {
    this.navCtrl.push(SetListSliderPage, {
      entries: this.entries,
      index: index
    });

  }

}
