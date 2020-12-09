import {Component, Input} from '@angular/core';
import {NavBarService} from './nav-bar.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  @Input()
  brandName: string;
  @Input()
  brandLogoUrl: string;

  constructor(public navBarService: NavBarService) {
  }

}
