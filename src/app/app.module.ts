import { SetListSliderPage } from './../pages/setlistslider/setlistslider';
import { SetListService } from './setlist.service';
import { SetListviewPage } from './../pages/setlistview/setlistview';
import { SetListeditPage } from './../pages/setlistedit/setlistedit';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SongsPage } from '../pages/songs/songs';
import { SongviewPage } from './../pages/songview/songview';
import { SongeditPage } from './../pages/songedit/songedit';
import { SetListsPage } from './../pages/setlists/setlists';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { PapaParseModule } from 'ngx-papaparse';

import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { FeedbackController } from './feedback.controller';



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
    SongsPage,
    SongviewPage,
    SongeditPage,
    SetListsPage,
    SetListeditPage,
    SetListviewPage,
    SetListSliderPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseconfig),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireDatabaseModule,
    PapaParseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SongsPage,
    SongviewPage,
    SongeditPage,
    SetListsPage,
    SetListeditPage,
    SetListviewPage,
    SetListSliderPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus,
    Facebook,

    AuthService,
    DataService,
    SetListService,
    FeedbackController
  ]
})
export class AppModule {}
