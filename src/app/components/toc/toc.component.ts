import {Component, Input} from '@angular/core';
import {TocItem} from '../../models/toc-item.model';

@Component({
  selector: 'app-toc',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.scss']
})
export class TocComponent {

  @Input()
  items: TocItem[];

  constructor() {
  }
}
