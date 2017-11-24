import { Observable } from 'rxjs/Observable';
import { FeedbackController } from './../../app/feedback.controller';
import { SetList, DataService, Song } from './../../app/data.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-setListedit',
  templateUrl: 'setListedit.html',
})
export class SetListeditPage {

  setList: SetList;
  songs: Observable<Song[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService : DataService,
      private FeedbackCtrl: FeedbackController) {
    let setList = navParams.get("setList");
    this.setList = setList !== undefined ? setList : this.getEmpty();
  }

  getEmpty() {
    return { 
      id: null,
      date: 0,
      title: "",
      setListEntries: []
    } as SetList;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetListeditPage');
  }

  async setListSaveTapped(event) {
    try {
      await this.dataService.saveSetList(this.setList);
      this.FeedbackCtrl.successFeedback("Seltlist saved");
    } catch (error) {
      this.FeedbackCtrl.errorFeedback("Seltlist save error", error);
    }
    this.navCtrl.pop();
  }  
}
