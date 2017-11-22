import { FeedbackController } from './../../app/feedback.controller';
import { SetList, DataService } from './../../app/data.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-setlistedit',
  templateUrl: 'setlistedit.html',
})
export class SetlisteditPage {

  setList: SetList;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService : DataService,
      private FeedbackCtrl: FeedbackController) {
    let inp = navParams.get("setList");
    this.setList = inp !== undefined ? inp : this.getEmpty();
  }

  getEmpty() {
    return { 
      id: null,
      date: 0,
      title: "",
      songids: []
    } as SetList;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetlisteditPage');
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
