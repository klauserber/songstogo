import { Injectable } from '@angular/core';

import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';


@Injectable()
export class AuthService {


    constructor(private google: GooglePlus, private facebook: Facebook) {

    }


    loginGoogle() {
        this.google.login({}).then((obj) => {
            console.log(obj);
            alert(obj.displayName);
          }).catch((err) => {
            console.log(err);        
          }
        );        
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