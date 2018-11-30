import { DataService } from './data.service';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Platform } from '@ionic/angular';


@Injectable()
export class AuthService {

    private user: firebase.User = null;

    authState: Observable<firebase.User>;

    loginState: Subject<firebase.User>;

    constructor(private google: GooglePlus, private facebook: Facebook, private afAuth: AngularFireAuth,
        public platform: Platform, private data: DataService) {

      this.authState = this.afAuth.authState;
      this.loginState = new Subject<firebase.User>();

      this.authState.subscribe(user => {
        this.user = user;
        this.data.initUserDoc(user);
        this.loginState.next(user);
      });
    }


    loginGoogle() {
      if (this.platform.is('cordova')) {
        this.google.login(    {
          'webClientId': '1031297615094-eo5chp8lq9phq2aq48gn9r2vmnsblrha.apps.googleusercontent.com',
          'offline': true,
        }).then((obj) => {
          this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(obj.idToken))
          .then(() => {
            console.log('signin success');
          })
          .catch((error) => {
            console.log('signin error: ' + error);
          });
        }).catch((err) => {
          console.log(err);
        });
      } else {
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(() => {
            console.log('signed in with google');
        });
      }
    }

    loginFacebook() {
      if (this.platform.is('cordova')) {
        this.facebook.login(['public_profile', 'email']).then((res: FacebookLoginResponse) => {
          this.afAuth.auth.signInWithCredential(firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken))
          .then(() => {
            console.log('signin success');
          })
          .catch((error) => {
            console.log('signin error: ' + error);
          });
        }).catch((e) => {
          console.log('Error logging into Facebook', e);
        });
      } else {
        this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(() => {
            console.log('signed in with facebook');
        });
      }
    }

    logout() {
      // this.afAuth.auth.signOut() + ' (' + this.user.providerId + ')';
      this.afAuth.auth.signOut().then(() => {
          console.log('signed out');
      });
    }

    getUserInfo(): String {
      return this.user.displayName + ' (' + this.user.providerData[0].providerId + ')';

    }

    isAuthenticated(): Boolean {
      return this.user !== null;
    }

}
