import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SongeditPage } from './songedit';

@NgModule({
  declarations: [
    SongeditPage,
  ],
  imports: [
    IonicPageModule.forChild(SongeditPage),
  ],
})
export class SongeditPageModule {}
