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

  addDataToDB(){
    let buttonText = ''
    let title = '';
    let link = '';
    let infoObject = [


      ]


    this.firebaseServ.setDataInFirebase('InformationObjects', title, {
      title: title,
      infoLink: link,
      buttonText: buttonText,
      information: infoObject
    })
  }
}

// {header: '', info: ''},

