import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SetListEntryModel } from '../../app/setlist.service';

/**
 * Generated class for the SetlistsliderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-setlistslider',
  templateUrl: 'setlistslider.html',
})
export class SetListSliderPage {

  entries: SetListEntryModel[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.entries = navParams.get("entries");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetlistsliderPage');
  }

}
