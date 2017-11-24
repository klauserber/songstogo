import { SetListeditPage } from './../setlistedit/setlistedit';
import { DataService, SetList } from './../../app/data.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'page-setListview',
  templateUrl: 'setListview.html',
})
export class SetListviewPage implements OnInit {

  setList: SetList;

  ngOnInit(): void {
    this.initSetList();
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetListviewPage');
  }

  async initSetList() {
    let id = this.navParams.get("setListid");
    let setList$ = await this.dataService.findSetListById(id);

    setList$.subscribe((setList) => {
      this.setList = setList;
    });
  }

  setListEditTapped(event) {
    this.navCtrl.push(SetListeditPage, {
      setList: this.setList
    });
  }

}
