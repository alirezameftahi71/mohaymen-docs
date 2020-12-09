import { Component, OnInit } from '@angular/core';
import {NavBarService} from '../components/nav-bar/nav-bar.service';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss']
})
export class NotFoundPageComponent implements OnInit {

  constructor(private navBarService: NavBarService) { }

  ngOnInit(): void {
    this.navBarService.navbarButtons = [];
  }

}
