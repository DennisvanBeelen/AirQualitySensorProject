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
  columnsToDisplay = ['id', 'location', 'timestamp', 'sensorData'];
  expandedElement: SensorUnits | null;

  constructor(public dialog: MatDialog) {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openPopup(moduleRowData) {
    this.dialog.open(UnitsPopupComponent, {data: {moduleData: moduleRowData}});
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
  BAROMETER: {name: 'Barometer', unitType: 'bar',},
  TEMPERATURE: {name: 'Temperature', unitType: '°',},
  ALTIMETER: {name: 'Altimeter', unitType: 'meter',},
  AIRQUALITY: {name: 'Air quality', unitType: '%',},
  HUMIDITY: {name: 'humidity', unitType: '%',},
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
