import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SetListSliderPage } from './../setlistslider/setlistslider';
import { SetListService, SetListEntryModel } from './../../setlist.service';
import { SetListeditPage } from './../setlistedit/setlistedit';
import { DataService, SetList } from './../../data.service';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'page-setListview',
  templateUrl: 'setlistview.html',
})
export class SetListviewPage implements OnInit {

  setList: SetList;
  entries: SetListEntryModel[];
  

  ngOnInit(): void {
    this.initSetList();
  }

  constructor(private route: ActivatedRoute, private dataService: DataService, private setListService: SetListService) {}

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


}
