import {Component, OnInit} from '@angular/core';
import {airQualityInformationObject, SensorType} from "../../interfaces";
import {firebaseService} from "../../services/firebaseService";

@Component({
  selector: 'app-information',
  providers: [firebaseService],
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  ST = [SensorType.PRESSURE, SensorType.AIRQUALITY, SensorType.HUMIDITY, SensorType.TEMPERATURE, SensorType.ALTITUDE, SensorType.CO2]
  informationData;
  infoData;

  constructor( private firebaseServ: firebaseService) {
  }

  ngOnInit(): void {
    this.firebaseServ.getLiveCollectionFromFirebase('InformationObjects').subscribe(data => (this.infoData = data));
  }

  sensorInformationButtonClicked(sensor) {
    this.informationData = {sensor: sensor};
  }

  informationButtonClicked(information) {
    this.informationData = {information: information.payload.doc.data()};
  }

  addTestDataToDB(){
    this.firebaseServ.setDataInFirebase('InformationObjects', 'testInfoObject5', {
      title: "testInfo5",
      infoLink: "www.wikipedia.org",
      information: [
        {header: 'testHeader1', info: 'this is the actual info that is going to inform you.'},
        {header: 'testHeader1', info: 'this is the actual info that is going to inform you.'},
        {header: 'testHeader2', info: 'this is the actual info that is going to inform you.'}
      ]
    })
  }
}

