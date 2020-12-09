import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Version} from '../../models/version.model';

@Component({
  selector: 'app-version-select',
  templateUrl: './version-select.component.html',
  styleUrls: ['./version-select.component.scss']
})
export class VersionSelectComponent implements OnInit {
  @Input()
  selectedVersionValue: string;
  @Input()
  versions: Version[];
  @Output()
  selectedVersionChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onSelectedVersionChange(value: string) {
    this.selectedVersionChanged.emit(value);
  }
}
