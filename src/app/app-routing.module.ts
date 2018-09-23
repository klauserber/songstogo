import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './pages/home/home'
import { SongsPage } from './pages/songs/songs'
import { SongviewPage } from './pages/songview/songview'
import { SongeditPage } from './pages/songedit/songedit'

const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'songs', component: SongsPage },
  { path: 'songview/:id', component: SongviewPage }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
