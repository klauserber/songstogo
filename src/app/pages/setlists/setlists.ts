import { FeedbackController } from './../../feedback.controller';
import { DataService, SetList } from './../../data.service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from '@ionic/angular';


@Component({
  selector: 'page-setLists',
  templateUrl: 'setlists.html',
})
export class SetListsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService,
    private alertCtrl: AlertController, private feedbackCtrl: FeedbackController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetListsPage');
  }


  async showRemoveConfirm(event, setList: SetList) {
    event.stopPropagation();
    const confirm = await this.alertCtrl.create({
      header: "Remove SetList",
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
