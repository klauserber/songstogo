import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Injectable()
export class FeedbackController {

  constructor(private toastCtrl: ToastController) {
  }
  /*
  public handle(promise: Promise<any>, successMsg: string, errorMsg: string) {
    promise.then(() => {
      this.successFeedback(successMsg);
    }).catch((err) => {
      this.errorFeedback(errorMsg, err);
    });
    return promise;
  }
  */

  successFeedback(msg: string) {
    this.feedback(msg, 'success').catch((reason) => console.log('cannot display success feedback: ' + reason));
  }

  errorFeedback(msg: string, err) {
    console.log('Error: ' + msg, err);
    this.feedback(msg, 'danger').catch((reason) => console.log('cannot display error feedback: ' + reason));
  }

  private async feedback(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      color: color
    });

    toast.present();
  }
}
