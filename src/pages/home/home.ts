import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../app/auth.service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  constructor(public navCtrl: NavController, public authService: AuthService) {
  }

  fileChange(e) {
    let fileList: FileList = e.target.files;
  }

}
