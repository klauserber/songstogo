import { FeedbackController } from '../../feedback.controller';
import { NavController, AlertController, Slides, Content } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SetListService, SetListEntryModel } from '../../setlist.service';
import { DataService, SetList } from '../../data.service';
import {AfterContentChecked, Component, ViewChild} from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'page-setListview',
  templateUrl: 'setlistview.html',
  styleUrls: [ 'setlistview.scss' ]
})
export class SetListviewPage implements OnInit, AfterContentChecked {

  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;


  listMode = true;

  setList: SetList;
  entries: SetListEntryModel[];

  showPrev = true;
  showNext = true;

  constructor(private authService: AuthService, private route: ActivatedRoute, private dataService: DataService,
              private setListService: SetListService, private alertCtrl: AlertController, private feedbackCtrl: FeedbackController,
              private navController: NavController) {}

  ngOnInit(): void {
    this.initSetList().catch(reason => this.feedbackCtrl.errorFeedback('error on setlist init.', reason));
    this.authService.loginState.subscribe(() => this.initSetList());
  }

  ngAfterContentChecked() {
    this.slides.ionSlideDidChange.subscribe(() => {
      this.updateButtons();
    });
  }

  goBack(event) {
    if (this.isSlideMode()) {
      this.listMode = true;
      event.stopPropagation();
    } else {
      this.navController.goBack();
    }
  }

  isListMode() {
    return this.listMode;
  }

  isSlideMode() {
    return !this.listMode;
  }

  isShowPrev() {
    return !this.listMode && this.showPrev;
  }
  isShowNext() {
    return !this.listMode && this.showNext;
  }

  openSlide(idx: number) {
    this.listMode = false;
    setTimeout(() => {
      this.slides.update();
      this.slides.length().then((val) => {
        console.log('slides length #2: ' + val);
        this.slides.slideTo(idx, 0);
        this.content.scrollToTop();
        this.updateButtons();
      });
    }, 300);
  }

  private updateButtons() {
    this.slides.isBeginning().then((val) => this.showPrev = !val);
    this.slides.isEnd().then((val) => this.showNext = !val);
  }

  async initSetList() {
    this.route.paramMap.pipe(switchMap((params: ParamMap) => this.dataService.findSetListById(params.get('id'))))
      .subscribe((setList) => {
        this.setList = setList;
        this.entries = this.setListService.createEntriesModel(setList.setListEntries);
      });
  }

  async showRemoveConfirm(event) {
    event.stopPropagation();
    const title = this.setList.title;
    const confirm = await this.alertCtrl.create({
      header: 'Remove SetList',
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

  onShowRemoveConfirm(event) {
    this.showRemoveConfirm(event).catch(reason => this.feedbackCtrl.errorFeedback(
        'error on show remove.', reason));
  }
}
