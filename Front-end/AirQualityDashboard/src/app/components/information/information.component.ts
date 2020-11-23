import { Component, OnInit } from '@angular/core';
import {SensorType} from "../../interfaces";

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  sensorType = SensorType;

  constructor() { }

  ngOnInit(): void {
    console.log(this.sensorType);
  }

  informationButtonClicked() {

  }
}
