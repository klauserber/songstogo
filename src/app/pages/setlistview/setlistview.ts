import { FeedbackController } from './../../feedback.controller';
import { NavController, AlertController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SetListSliderPage } from './../setlistslider/setlistslider';
import { SetListService, SetListEntryModel } from './../../setlist.service';
import { SetListeditPage } from './../setlistedit/setlistedit';
import { DataService, SetList } from './../../data.service';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'page-setListview',
  templateUrl: 'setlistview.html',
})
export class SetListviewPage implements OnInit {

  setList: SetList;
  entries: SetListEntryModel[];
  

  ngOnInit(): void {
    this.initSetList();
    this.authService.loginState.subscribe((user) => this.initSetList());
  }

  constructor(private authService: AuthService, private route: ActivatedRoute, private dataService: DataService, private setListService: SetListService,
    private alertCtrl: AlertController, private feedbackCtrl: FeedbackController, private navController: NavController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetListviewPage');
  }

  async initSetList() {
    this.route.paramMap.pipe(switchMap((params: ParamMap) => this.dataService.findSetListById(params.get("id"))))
      .subscribe((setList) => {
        this.setList = setList;
        this.entries = this.setListService.createEntriesModel(setList.setListEntries);
      });    
  }


  async showRemoveConfirm(event) {
    event.stopPropagation();
    let title = this.setList.title;
    const confirm = await this.alertCtrl.create({
      header: "Remove SetList",
      message: 'Remove "' + title + '"?',
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
              await this.dataService.removeSetList(this.setList.id);
              this.feedbackCtrl.successFeedback('SetList "' + title + '" removed');
              this.navController.goBack();
            } catch (error) {
              this.feedbackCtrl.errorFeedback('Failed to remove SetList "' + title + '"', error);
            }
          }
        }
      ]
    });
    confirm.present();
  }

}
