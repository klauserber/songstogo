import { FeedbackController } from './../../app/feedback.controller';
import { SetListviewPage } from './../setlistview/setlistview';
import { SetListeditPage } from './../setlistedit/setlistedit';
import { DataService, SetList } from './../../app/data.service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-setLists',
  templateUrl: 'setLists.html',
})
export class SetListsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService,
    private alertCtrl: AlertController, private feedbackCtrl: FeedbackController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetListsPage');
  }

  setListTapped(event, setList: SetList) {
    this.navCtrl.push(SetListviewPage, {
      setListid: setList.id
    });
  }

  setListNewTapped(event) {
    this.navCtrl.push(SetListeditPage);
  }

  showRemoveConfirm(event, setList: SetList) {
    event.stopPropagation();
    let confirm = this.alertCtrl.create({
      title: "Remove SetList",
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
              this.feedbackCtrl.successFeedback('SetList "' + setList.title + '" removed');
            } catch (error) {
              this.feedbackCtrl.errorFeedback('Failed to remove SetList "' + setList.title + '"', error);
            }
          }
        }
      ]
    });
    confirm.present();
  }
  
}
