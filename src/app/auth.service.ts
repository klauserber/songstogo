import { Injectable } from '@angular/core';

import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Platform } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';



export interface StgUser {
  id: string;
  name: string;
}


@Injectable()
export class AuthService {

    private user: firebase.User = null;

    private userDoc: AngularFirestoreDocument<StgUser>;
    stgUser: Observable<StgUser>;

    constructor(private google: GooglePlus, private facebook: Facebook, private afAuth: AngularFireAuth,
        public platform: Platform, private afs: AngularFirestore) {



      this.afAuth.authState.subscribe(user => {
        this.user = user;
        this.initUserDoc();
      });
    }


    initUserDoc() {
      if(this.isAuthenticated()) {
        this.userDoc = this.afs.collection<StgUser>("users").doc(this.user.uid);
        this.stgUser = doc.valueChanges();


        if(doc === null) {
          this.afs.collection<StgUser>("users").add({
            id: this.user.uid,
            name: this.user.displayName
          });
          doc = this.afs.collection<StgUser>("users").doc(this.user.uid);
        }
        console.log(doc);
      }

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
            console.log("signin success");
          })
          .catch((error) => {
            console.log("signin error: " + error);
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
      if(this.platform.is("cordova")) {
        this.facebook.login(['public_profile', 'email']).then((res: FacebookLoginResponse) => {
          this.afAuth.auth.signInWithCredential(firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken))
          .then((success) => {
            console.log("signin success");
          })
          .catch((error) => {
            console.log("signin error: " + error);
          });
        }).catch((e) => {
          console.log("Error logging into Facebook", e);
        });
      }
      else {
        this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
      }
    }

    logout() {
      this.afAuth.auth.signOut() + " (" + this.user.providerId + ")";

    }

    getUserInfo() : String {
      return this.user.displayName + " (" + this.user.providerData[0].providerId + ")";
    }

    isAuthenticated() : Boolean {
      return this.user !== null;
    }

}
