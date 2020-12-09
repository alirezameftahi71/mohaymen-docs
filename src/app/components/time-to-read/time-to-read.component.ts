import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-time-to-read',
  templateUrl: './time-to-read.component.html',
  styleUrls: ['./time-to-read.component.scss']
})
export class TimeToReadComponent implements OnInit, OnChanges {
  @Input()
  wordCount: number;

  readTime: number;
  unit: string;

  // private unitSeconds = 'ثانیه';
  private unitMinutes = 'دقیقه';

  constructor() {
  }

  ngOnInit(): void {
    this.readTime = 0;
    this.unit = this.unitMinutes;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateReadTime();
  }

  calculateReadTime() {
    const calculatedReadTime = `${(this.wordCount || 0) / 100}`.split('.');
    const minutes = +calculatedReadTime[0];
    // const seconds = calculatedReadTime.length ? +calculatedReadTime[1] : 0;
    this.readTime = minutes ? minutes : 1;
    // this.unit = minutes ? this.unitMinutes : this.unitSeconds;
  }
}
