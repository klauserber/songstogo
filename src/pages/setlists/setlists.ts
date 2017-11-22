import { FeedbackController } from './../../app/feedback.controller';
import { SetlistviewPage } from './../setlistview/setlistview';
import { SetlisteditPage } from './../setlistedit/setlistedit';
import { DataService, SetList } from './../../app/data.service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-setlists',
  templateUrl: 'setlists.html',
})
export class SetlistsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService,
    private alertCtrl: AlertController, private feedbackCtrl: FeedbackController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetlistsPage');
  }

  setListTapped(event, setList: SetList) {
    this.navCtrl.push(SetlistviewPage, {
      setListid: setList.id
    });
  }

  setListNewTapped(event) {
    this.navCtrl.push(SetlisteditPage);
  }

  showRemoveConfirm(event, setList: SetList) {
    event.stopPropagation();
    let confirm = this.alertCtrl.create({
      title: "Remove Setlist",
      message: 'Remove "' + setList.title + '"?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: async () => {
            try {
              await this.dataService.removeSetList(setList.id);
              this.feedbackCtrl.successFeedback('Setlist "' + setList.title + '" removed');
            } catch (error) {
              this.feedbackCtrl.errorFeedback('Failed to remove Setlist "' + setList.title + '"', error);
            }
          }
        }
      ]
    });
    confirm.present();
  }
  
}
