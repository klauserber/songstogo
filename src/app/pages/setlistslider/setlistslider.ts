import { DataService } from './../../data.service';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './../../auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from '@ionic/angular';
import { SetListEntryModel, SetListService } from '../../setlist.service';
import { SetList } from '../../data.service';
import { of } from 'rxjs';

/**
 * Generated class for the SetlistsliderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-setlistslider',
  templateUrl: 'setlistslider.html',
  styleUrls: [ "setlistslider.scss" ]
})
export class SetListSliderPage {

  @ViewChild(Slides) slides: Slides;

  entries: SetListEntryModel[];
  setList: SetList;

  showPrev: boolean = true;
  showNext: boolean = true;

  constructor(private route: ActivatedRoute, private authService: AuthService, private dataService: DataService,
    private setListService: SetListService) {}

  ngOnInit() {
    this.initSetList();
    this.authService.loginState.subscribe((user) => this.initSetList());
  }

  ngOnChanges() {
    console.log("ngOnChanges");
  }

  async initSetList() {
    this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      return of({
        id: params.get("id"),
        index: params.get("index")
      })
    })).subscribe((p) => {
      this.dataService.findSetListById(p.id)
        .subscribe((setList) => {
          this.setList = setList;
          this.entries = this.setListService.createEntriesModel(setList.setListEntries);
          this.slides.ionSlidesDidLoad.subscribe((val) => {
            this.updateList(p.index);
            // Workaround for reload
            setTimeout(() => {
              this.updateList(p.index);
            }, 1000);
          });
          this.slides.ionSlideDidChange.subscribe((val) => {
            this.updateButtons();
          });
      });
    });
  }

  private updateButtons() {
    this.slides.isBeginning().then((val) => this.showPrev = !val);
    this.slides.isEnd().then((val) => this.showNext = !val);
  }

  private updateList(index) {
    this.slides.update();
    this.slides.slideTo(parseInt(index));
    this.updateButtons();                
  }

}
