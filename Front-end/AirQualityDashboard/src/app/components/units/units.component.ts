import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {UnitsPopupComponent} from "./units-popup/units-popup.component";
import {SensorType, SensorUnits} from "../../interfaces";
import {firebaseService} from "../../firebaseService";

@Component({
  selector: 'app-units',
  providers: [firebaseService],
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),],
})
export class UnitsComponent implements OnInit {

  dataSource;
  columnsToDisplay = ['location', 'id', 'timestamp', 'sensorData'];
  expandedElement: SensorUnits | null;
  extraAllowance = 0.1; // amount you can go over sensorMin and sensorMax before getting a sad smiley.
  @Input() compactMode = false; // compact mode for dashboard.
  sensorDataCollectioPath = 'sensorDataTest';

  constructor(public dialog: MatDialog, private firebaseServ: firebaseService) {
  }

  ngOnInit(): void {
    this.checkForCompactMode();
    this.firebaseServ.getLiveCollectionFromFirebase(this.sensorDataCollectioPath).subscribe(data => (this.dataSource = new MatTableDataSource(data)));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openPopup(sensorRowData) {
    sensorRowData = this.addSafetyDataToDialogData(sensorRowData);
    this.dialog.open(UnitsPopupComponent, {data: sensorRowData});
  }

  addSafetyDataToDialogData(sensorRowData) {
    sensorRowData = sensorRowData.payload.doc.data();
    sensorRowData.safetyRating = [];
    sensorRowData.safetyColor = [];

    for (let sensor of sensorRowData.sensorData) {
      let sr = this.getSafetyRating(sensor.sensorName, sensor.sensorValue);
      sensorRowData.safetyRating.push(sr);
      sensorRowData.safetyColor.push(this.getSafetyColorCode(sr))
    }
    return sensorRowData;
  }

  getSafetyColorCode(safetyRating: string) {
    switch (safetyRating) {
      case "mood":
        return "#03EA18"

      case "sentiment_dissatisfied":
        return "#fbbe00"

      case "mood_bad":
        return "#ff0000"
    }
  }

  getSafetyRating(sensorName, sensorValue) {
    let sensor = this.getCorrectSensorType(sensorName);

    if (sensorValue < sensor.maximumValue && sensorValue > sensor.minimalValue) {
      return "mood"; // mood is happy smiley
    } else if (sensorValue < (sensor.maximumValue + (sensor.maximumValue * this.extraAllowance)) && sensorValue > (sensor.minimalValue - (sensor.minimalValue * this.extraAllowance))) {
      return "sentiment_dissatisfied"; // sentiment_dissatisfied is not super happy smiley
    } else {
      return "mood_bad"; // sad smiley
    }
  }

  getCorrectSensorType(sensorName) {
    switch (sensorName) {
      case SensorType.BAROMETER.name:
        return SensorType.BAROMETER;

      case SensorType.ALTIMETER.name:
        return SensorType.ALTIMETER;

      case SensorType.TEMPERATURE.name:
        return SensorType.TEMPERATURE;

      case SensorType.HUMIDITY.name:
        return SensorType.HUMIDITY;

      case SensorType.AIRQUALITY.name:
        return SensorType.AIRQUALITY;
    }
  }

  checkForCompactMode() {
    if (this.compactMode) {
      this.columnsToDisplay = ['location', 'id', 'timestamp'];
    }
  }

  createReadableTimestamp(timestamp) {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  }

  // putTestDataInDB() {
  //   for (let i = 0; i < ELEMENT_DATA.length; i++) {
  //     this.firebaseServ.setDataInFirebase('sensorDataTest', ELEMENT_DATA[i].id + ELEMENT_DATA[i].location, ELEMENT_DATA[i])
  //   }
  // }

}

// mockdata untill we get a working DB.
// let ELEMENT_DATA: SensorUnits[] = [
//   {
//     id: 123456789,
//     location: "Livingroom",
//     timestamp: new Date(),
//     sensorData: [
//       {sensorName: SensorType.BAROMETER.name, sensorValue: 1.2, sensorDataUnit: SensorType.BAROMETER.unitType},
//       {sensorName: SensorType.ALTIMETER.name, sensorValue: 2, sensorDataUnit: SensorType.ALTIMETER.unitType},
//       {sensorName: SensorType.TEMPERATURE.name, sensorValue: 80, sensorDataUnit: SensorType.TEMPERATURE.unitType},
//       {sensorName: SensorType.HUMIDITY.name, sensorValue: 80, sensorDataUnit: SensorType.HUMIDITY.unitType},
//       {sensorName: SensorType.AIRQUALITY.name, sensorValue: 35, sensorDataUnit: SensorType.AIRQUALITY.unitType}]
//   },
//   {
//     id: 123876789,
//     location: "Bedroom",
//     timestamp: new Date(),
//     sensorData: [
//       {sensorName: SensorType.BAROMETER.name, sensorValue: 1.2, sensorDataUnit: SensorType.BAROMETER.unitType},
//       {sensorName: SensorType.ALTIMETER.name, sensorValue: 2, sensorDataUnit: SensorType.ALTIMETER.unitType},
//       {sensorName: SensorType.TEMPERATURE.name, sensorValue: 80, sensorDataUnit: SensorType.TEMPERATURE.unitType},
//       {sensorName: SensorType.HUMIDITY.name, sensorValue: 80, sensorDataUnit: SensorType.HUMIDITY.unitType},
//       {sensorName: SensorType.AIRQUALITY.name, sensorValue: 35, sensorDataUnit: SensorType.AIRQUALITY.unitType}]
//   }, {
//     id: 137656789,
//     location: "Attic",
//     timestamp: new Date(),
//     sensorData: [
//       {sensorName: SensorType.BAROMETER.name, sensorValue: 1.2, sensorDataUnit: SensorType.BAROMETER.unitType},
//       {sensorName: SensorType.ALTIMETER.name, sensorValue: 2, sensorDataUnit: SensorType.ALTIMETER.unitType},
//       {sensorName: SensorType.TEMPERATURE.name, sensorValue: 80, sensorDataUnit: SensorType.TEMPERATURE.unitType},
//       {sensorName: SensorType.HUMIDITY.name, sensorValue: 80, sensorDataUnit: SensorType.HUMIDITY.unitType},
//       {sensorName: SensorType.AIRQUALITY.name, sensorValue: 35, sensorDataUnit: SensorType.AIRQUALITY.unitType}]
//   }, {
//     id: 912987489,
//     location: "Office",
//     sensorData: [
//       {
//         timestamp: new Date(),
//         data: [{sensorName: SensorType.BAROMETER.name, sensorValue: 1.2, sensorDataUnit: SensorType.BAROMETER.unitType},
//           {sensorName: SensorType.ALTIMETER.name, sensorValue: 2, sensorDataUnit: SensorType.ALTIMETER.unitType},
//           {sensorName: SensorType.TEMPERATURE.name, sensorValue: 80, sensorDataUnit: SensorType.TEMPERATURE.unitType},
//           {sensorName: SensorType.HUMIDITY.name, sensorValue: 80, sensorDataUnit: SensorType.HUMIDITY.unitType},
//           {sensorName: SensorType.AIRQUALITY.name, sensorValue: 35, sensorDataUnit: SensorType.AIRQUALITY.unitType}]
//       }
//     ]
//   }
// ];
