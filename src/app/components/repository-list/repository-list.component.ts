import {Component, Input, OnInit} from '@angular/core';
import {Document} from '../../models/document.model';

@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.scss']
})
export class RepositoryListComponent implements OnInit {

  @Input()
  items: Document[];

  constructor() {
  }

  ngOnInit() {
  }

}
