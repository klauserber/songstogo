import { FormsModule } from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
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

// import { PapaParseModule } from 'ngx-papaparse';

import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { FeedbackController } from './feedback.controller';
import { RouteReuseStrategy } from '@angular/router';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { firebaseconfig } from './firebaseconfig';

@NgModule({
  declarations: [
    SongsToGoApp,
    HomePage,
    SongsPage,
    SongviewPage,
    SongeditPage,
    SetListsPage,
    SetListeditPage,
    SetListviewPage
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(firebaseconfig),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireDatabaseModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    // PapaParseModule
  ],
  entryComponents: [
    SongsToGoApp,
    HomePage,
    SongsPage,
    SongviewPage,
    SongeditPage,
    SetListsPage,
    SetListeditPage,
    SetListviewPage
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
