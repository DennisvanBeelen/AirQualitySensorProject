import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-information-display',
  templateUrl: './information-display.component.html',
  styleUrls: ['./information-display.component.scss']
})
export class InformationDisplayComponent implements OnInit {

  @Input() informationData;

  constructor() { }

  ngOnInit(): void {
  }

}
