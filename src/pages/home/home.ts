import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../app/auth.service';

import { DataService } from '../../app/data.service';

import * as fileSaver from 'file-saver';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  @ViewChild('fileInp') fileInput: ElementRef;
  @ViewChild('fileHtmlInp') fileHtmlInput: ElementRef;

  constructor(public navCtrl: NavController, public authService: AuthService, private dataService: DataService) {
  }

  fileChange(e) {
    let fileList: FileList = e.target.files;
    this.dataService.importSongs(fileList[0]);
  }

  onImportClick() {
    this.fileInput.nativeElement.click();
  }

  fileChangeHtml(e) {
    let fileList: FileList = e.target.files;
    this.dataService.importSongsFromHtml(fileList[0]);
  }
  onImportHtmlClick() {
    this.fileHtmlInput.nativeElement.click();
  }

  exportSongs() {
    this.dataService.exportSongs().then( (data) => {
      let file = new Blob([ data ], { type: 'text/yaml;charset=utf-8' });
      fileSaver.saveAs(file, "songs.yaml");
    });
  }

}
