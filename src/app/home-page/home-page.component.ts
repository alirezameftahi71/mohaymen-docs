import { Component, OnInit } from '@angular/core';
import {AppService} from '../app.service';
import {Document} from '../models/document.model';
import {NavBarService} from '../components/nav-bar/nav-bar.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  products: Document[];
  navBarItems: Document[];

  constructor(public appService: AppService,
              private navBarService: NavBarService) {
  }

  
  async ngOnInit() {
    this.setNavBarButtons();
    this.products = await this.appService.getRepositories();
  }


  private setNavBarButtons(): void {
    this.navBarService.navbarButtons = this.navBarItems = [
      {title: 'مستندات', url: '/'}
    ];
  }

}
