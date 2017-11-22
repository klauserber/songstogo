import { Injectable } from "@angular/core";
import { ToastController } from "ionic-angular/components/toast/toast-controller";
import { ToastOptions } from "ionic-angular/components/toast/toast-options";


@Injectable()
export class FeedbackController {

  constructor(private toastCtrl: ToastController) {
  }

  public handle(promise: Promise<any>, successMsg: string, errorMsg: string) {
    promise.then(() => {
      this.successFeedback(successMsg);
    }).catch((err) => {
      this.errorFeedback(errorMsg, err);
    });
    return promise;
  }


  successFeedback(msg: string) {
    this.feedback(msg, "success");
  }

  errorFeedback(msg: string, err) {
    console.log("Error: " + msg, err);
    this.feedback(msg, "error");
  }

  private feedback(msg: string, cssClass: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      cssClass: cssClass
    } as ToastOptions);

    toast.present();
  }
}
