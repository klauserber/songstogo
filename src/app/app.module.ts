import { SongviewPage } from './../pages/songview/songview';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SongsPage } from '../pages/songs/songs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AuthService } from './auth.service';
import { SongsService } from './songs.service';



var firebaseconfig = {
  apiKey: "AIzaSyDu3AefRahkUFd3LN5Kx0M-9-730USxAgI",
  authDomain: "de-isium-songstogo.firebaseapp.com",
  databaseURL: "https://de-isium-songstogo.firebaseio.com",
  projectId: "de-isium-songstogo",
  storageBucket: "de-isium-songstogo.appspot.com",
  messagingSenderId: "1031297615094"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    SongsPage,
    SongviewPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseconfig),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    SongsPage,
    SongviewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus,
    Facebook,

    AuthService,
    SongsService
  ]
})
export class AppModule {}
