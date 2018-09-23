import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SongeditPage } from './songedit';

@NgModule({
  declarations: [
    SongeditPage,
  ],
  imports: [
    IonicModule,
    RouterModule.forChild([{
      path: 'songedit',
      component: SongeditPage
    }]),
  ],
})
export class SongeditPageModule {}
