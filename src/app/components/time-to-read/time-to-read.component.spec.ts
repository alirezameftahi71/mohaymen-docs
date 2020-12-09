import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeToReadComponent } from './time-to-read.component';

describe('TimeToReadComponent', () => {
  let component: TimeToReadComponent;
  let fixture: ComponentFixture<TimeToReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeToReadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeToReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
