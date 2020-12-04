import {Component, OnInit} from '@angular/core';
import {airQualityInformationObject, SensorType} from "../../interfaces";
import {firebaseService} from "../../firebaseService";

@Component({
  selector: 'app-information',
  providers: [firebaseService],
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  ST = [SensorType.BAROMETER, SensorType.AIRQUALITY, SensorType.HUMIDITY, SensorType.TEMPERATURE, SensorType.ALTIMETER]
  informationData;

  constructor( private firebaseServ: firebaseService) {
  }

  infoData;

  ngOnInit(): void {
    this.firebaseServ.getLiveCollectionFromFirebase('InformationObjects').subscribe(data => (this.infoData = data));
  }


  sensorInformationButtonClicked(sensor) {
    this.informationData = {sensor: sensor};
  }

  informationButtonClicked(information) {
    this.informationData = {information: information.payload.doc.data()};
  }
}

