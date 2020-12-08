import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {MatDialog} from "@angular/material/dialog";
import {InformationPopupComponent} from "../../information/information-popup/information-popup.component";
import {SensorType} from "../../../interfaces";


@Component({
  selector: 'app-units-popup',
  templateUrl: './units-popup.component.html',
  styleUrls: ['./units-popup.component.scss']
})
export class UnitsPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  sensorClicked(sensor: any) {
    this.openPopup(SensorType[sensor.sensorName.toUpperCase().replace(' ', '')])
  }

  openPopup(sensorRowData) {
    this.dialog.open(InformationPopupComponent, {data: sensorRowData});
  }

  createReadableTimestamp(timestamp) {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  }
}
