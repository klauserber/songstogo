import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.scss']
})
export class SongsToGoApp {
  public appPages = [
    {
      title: 'Home',
      url: '/',
      icon: 'home'
    },
    {
      title: 'Songs',
      url: '/songs',
      icon: 'musical-notes'
    },
    {
      title: 'Setlists',
      url: '/setlists',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
