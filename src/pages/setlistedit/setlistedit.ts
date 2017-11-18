import { SetList, DataService } from './../../app/data.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-setlistedit',
  templateUrl: 'setlistedit.html',
})
export class SetlisteditPage {

  setList: SetList;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService : DataService) {
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

  setListSaveTapped(event) {
    this.dataService.saveSetList(this.setList);
    this.navCtrl.pop();
  }  
}
