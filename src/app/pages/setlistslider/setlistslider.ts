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

  constructor(private route: ActivatedRoute, private authService: AuthService, private dataService: DataService,
    private setListService: SetListService) {}

  ngOnInit() {
    this.initSetList();
    this.authService.loginState.subscribe((user) => this.initSetList());
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
            this.slides.slideTo(parseInt(p.index), 0);
        });
      });
    });
  }

}
