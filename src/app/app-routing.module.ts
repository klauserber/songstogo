import { SetListSliderPage } from './pages/setlistslider/setlistslider';
import { SetListeditPage } from './pages/setlistedit/setlistedit';
import { SetListviewPage } from './pages/setlistview/setlistview';
import { SetListsPage } from './pages/setlists/setlists';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './pages/home/home'
import { SongsPage } from './pages/songs/songs'
import { SongviewPage } from './pages/songview/songview'
import { SongeditPage } from './pages/songedit/songedit'

const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'songs', component: SongsPage },
  { path: 'songview/:id', component: SongviewPage },
  { path: 'songedit', component: SongeditPage },
  { path: 'songedit/:id', component: SongeditPage },
  { path: 'setlists', component: SetListsPage },
  { path: 'setlistview/:id', component: SetListviewPage },
  { path: 'setlistedit', component: SetListeditPage },
  { path: 'setlistedit/:id', component: SetListeditPage },
  { path: 'setlistslider/:id/:index', component: SetListSliderPage }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
