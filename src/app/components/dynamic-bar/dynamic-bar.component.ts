import {Component, Input, OnInit} from '@angular/core';
import {BaseItem} from '../../models/base-item.model';

@Component({
  selector: 'app-dynamic-bar',
  templateUrl: './dynamic-bar.component.html',
  styleUrls: ['./dynamic-bar.component.scss']
})
export class DynamicBarComponent implements OnInit {

  @Input()
  breadcrumbItems: BaseItem[];
  @Input()
  showEditBtn: boolean;
  @Input()
  editBtnPath: string;

  constructor() {
  }

  ngOnInit() {
  }


}
