import { Injectable } from '@angular/core';

import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Platform } from 'ionic-angular';


@Injectable()
export class AuthService {

    private user: Observable<firebase.User>;
    private fbuser: firebase.User;

    constructor(private google: GooglePlus, private facebook: Facebook, private afAuth: AngularFireAuth, public platform: Platform) {
      this.user = afAuth.authState;

      this.user.subscribe(next => {
         console.log(next);
         this.fbuser = next;
      });
    }


    loginGoogle() {
      if(this.platform.is("cordova")) {
        this.google.login(    {
          //'scopes': '... ', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
          'webClientId': '1031297615094-eo5chp8lq9phq2aq48gn9r2vmnsblrha.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
          'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        }).then((obj) => {
          this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(obj.idToken))
          .then((success) => {
            console.log("sign in success");
          })
          .catch((error) => {
            console.log("sign in error: " + error);
          });
        }).catch((err) => {
          console.log(err);
        });
      }
      else {
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      }
    }

    loginFacebook() {
        this.facebook.login(['public_profile', 'email']).then((res: FacebookLoginResponse) => {
            console.log(res);
            alert(res.authResponse.accessToken);
          }).catch((e) => {
            console.log("Error logging into Facebook", e);
          }
        );
      }
}
