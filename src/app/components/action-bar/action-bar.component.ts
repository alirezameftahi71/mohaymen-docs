import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { faBars, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-action-bar",
  templateUrl: "./action-bar.component.html",
  styleUrls: ["./action-bar.component.scss"]
})
export class ActionBarComponent implements OnInit {
  bars: IconDefinition = faBars;

  @Output()
  sideMenuToggleClicked = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onSideMenuToggleClick() {
    this.sideMenuToggleClicked.emit();
  }
}
