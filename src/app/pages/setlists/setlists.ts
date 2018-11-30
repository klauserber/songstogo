import { AuthService } from '../../auth.service';
import { Observable } from 'rxjs';
import { DataService, SetList } from '../../data.service';
import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'page-setLists',
  templateUrl: 'setlists.html',
})
export class SetListsPage implements OnInit {

  setLists: Observable<SetList[]>;

  constructor(private authService: AuthService, public dataService: DataService) {
  }

  ngOnInit() {
    this.setLists = this.dataService.findAllSetlists();
    this.authService.loginState.subscribe(() => this.setLists = this.dataService.findAllSetlists());
  }

}
