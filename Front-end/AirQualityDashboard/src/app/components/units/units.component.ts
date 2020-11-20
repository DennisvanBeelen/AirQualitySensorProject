import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {UnitsPopupComponent} from "./units-popup/units-popup.component";

@Component({
  selector: 'app-units',
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

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  columnsToDisplay = ['location', 'id', 'timestamp', 'sensorData'];
  expandedElement: SensorUnits | null;
  extraAllowance = 1.1; // amount you can go over sensorMin and sensorMax before getting a sad smiley.

  constructor(public dialog: MatDialog) {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openPopup(sensorRowData) {
    sensorRowData = this.addSafetyDataToDialogData(sensorRowData);
    this.dialog.open(UnitsPopupComponent, {data: sensorRowData});
  }

  addSafetyDataToDialogData(sensorRowData){
    sensorRowData.safetyRating = [];
    sensorRowData.safetyColor = [];

    for (let sensor of sensorRowData.sensorData){
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
    } else if (sensorValue < (sensor.maximumValue * this.extraAllowance) && sensorValue > this.addExtraMinimalAllowance(sensor.minimalValue)) {
      return "sentiment_dissatisfied"; // sentiment_dissatisfied is not super happy smiley
    } else {
      return "mood_bad"; // sad smiley
    }
  }

  addExtraMinimalAllowance(value) {
    if (value >= 0) {
      return value * -this.extraAllowance;
    } else {
      return value * this.extraAllowance;
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


  ngOnInit(): void {
  }
}

export interface SensorUnits {
  id: number;
  location: string;
  timestamp: Date;
  sensorData: Sensor[];
}

export interface Sensor {
  sensorName: string;
  sensorValue: number;
  sensorDataUnit: string;
}

export const SensorType = {
  BAROMETER: {name: 'Barometer', unitType: ' bar', minimalValue: 1, maximumValue: 2},
  TEMPERATURE: {name: 'Temperature', unitType: '°', minimalValue: 10, maximumValue: 30},
  ALTIMETER: {name: 'Altimeter', unitType: ' meter', minimalValue: -5, maximumValue: 30},
  AIRQUALITY: {name: 'Air quality', unitType: '%', minimalValue: 70, maximumValue: 100},
  HUMIDITY: {name: 'humidity', unitType: '%', minimalValue: 25, maximumValue: 75},
}

const ELEMENT_DATA: SensorUnits[] = [
  {
    id: 123456789,
    location: "Livingroom",
    timestamp: new Date(),
    sensorData: [
      {sensorName: SensorType.BAROMETER.name, sensorValue: 1.2, sensorDataUnit: SensorType.BAROMETER.unitType},
      {sensorName: SensorType.ALTIMETER.name, sensorValue: 2, sensorDataUnit: SensorType.ALTIMETER.unitType},
      {sensorName: SensorType.TEMPERATURE.name, sensorValue: 80, sensorDataUnit: SensorType.TEMPERATURE.unitType},
      {sensorName: SensorType.HUMIDITY.name, sensorValue: 80, sensorDataUnit: SensorType.HUMIDITY.unitType},
      {sensorName: SensorType.AIRQUALITY.name, sensorValue: 35, sensorDataUnit: SensorType.AIRQUALITY.unitType}]
  },
  {
    id: 123876789,
    location: "Bedroom",
    timestamp: new Date(),
    sensorData: [
      {sensorName: SensorType.BAROMETER.name, sensorValue: 1.2, sensorDataUnit: SensorType.BAROMETER.unitType},
      {sensorName: SensorType.ALTIMETER.name, sensorValue: 2, sensorDataUnit: SensorType.ALTIMETER.unitType},
      {sensorName: SensorType.TEMPERATURE.name, sensorValue: 80, sensorDataUnit: SensorType.TEMPERATURE.unitType},
      {sensorName: SensorType.HUMIDITY.name, sensorValue: 80, sensorDataUnit: SensorType.HUMIDITY.unitType},
      {sensorName: SensorType.AIRQUALITY.name, sensorValue: 35, sensorDataUnit: SensorType.AIRQUALITY.unitType}]
  }, {
    id: 137656789,
    location: "Attic",
    timestamp: new Date(),
    sensorData: [
      {sensorName: SensorType.BAROMETER.name, sensorValue: 1.2, sensorDataUnit: SensorType.BAROMETER.unitType},
      {sensorName: SensorType.ALTIMETER.name, sensorValue: 2, sensorDataUnit: SensorType.ALTIMETER.unitType},
      {sensorName: SensorType.TEMPERATURE.name, sensorValue: 80, sensorDataUnit: SensorType.TEMPERATURE.unitType},
      {sensorName: SensorType.HUMIDITY.name, sensorValue: 80, sensorDataUnit: SensorType.HUMIDITY.unitType},
      {sensorName: SensorType.AIRQUALITY.name, sensorValue: 35, sensorDataUnit: SensorType.AIRQUALITY.unitType}]
  }, {
    id: 912987489,
    location: "Office",
    timestamp: new Date(),
    sensorData: [
      {sensorName: SensorType.BAROMETER.name, sensorValue: 1.2, sensorDataUnit: SensorType.BAROMETER.unitType},
      {sensorName: SensorType.ALTIMETER.name, sensorValue: 2, sensorDataUnit: SensorType.ALTIMETER.unitType},
      {sensorName: SensorType.TEMPERATURE.name, sensorValue: 80, sensorDataUnit: SensorType.TEMPERATURE.unitType},
      {sensorName: SensorType.HUMIDITY.name, sensorValue: 80, sensorDataUnit: SensorType.HUMIDITY.unitType},
      {sensorName: SensorType.AIRQUALITY.name, sensorValue: 35, sensorDataUnit: SensorType.AIRQUALITY.unitType}]
  }
];
