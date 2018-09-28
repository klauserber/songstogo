import { FormsModule } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { SetListSliderPage } from './pages/setlistslider/setlistslider';
import { SetListService } from './setlist.service';
import { SetListviewPage } from './pages/setlistview/setlistview';
import { SetListeditPage } from './pages/setlistedit/setlistedit';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SongsToGoApp } from './app.component';
import { HomePage } from './pages/home/home';
import { SongsPage } from './pages/songs/songs';
import { SongviewPage } from './pages/songview/songview';
import { SongeditPage } from './pages/songedit/songedit';
import { SetListsPage } from './pages/setlists/setlists';


import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';

//import { PapaParseModule } from 'ngx-papaparse';

import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { FeedbackController } from './feedback.controller';
import { RouteReuseStrategy } from '@angular/router';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';


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
    SongsToGoApp,
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
    AppRoutingModule,
    BrowserModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(firebaseconfig),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireDatabaseModule,
    FormsModule
    //PapaParseModule
  ],
  entryComponents: [
    SongsToGoApp,
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
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    GooglePlus,
    Facebook,
    AuthService,
    DataService,
    SetListService,
    FeedbackController
  ],
  bootstrap: [SongsToGoApp]
})
export class AppModule {}
