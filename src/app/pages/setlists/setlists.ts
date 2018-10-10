import { AuthService } from './../../auth.service';
import { Observable } from 'rxjs';
import { FeedbackController } from './../../feedback.controller';
import { DataService, SetList } from './../../data.service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from '@ionic/angular';


@Component({
  selector: 'page-setLists',
  templateUrl: 'setlists.html',
})
export class SetListsPage {

  setlists: Observable<SetList[]>;

  constructor(private authService: AuthService, public navCtrl: NavController, public dataService: DataService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetListsPage');
  }

  ngOnInit() {
    this.setlists = this.dataService.findAllSetlists();
    this.authService.loginState.subscribe((user) => this.setlists = this.dataService.findAllSetlists());
  }
  
}
