import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {UnitsPopupComponent} from "./units-popup/units-popup.component";
import {SensorType, SensorUnits} from "../../interfaces";
import {firebaseService} from "../../services/firebaseService";
import {dataService} from "../../services/dataService";

@Component({
  selector: 'app-units',
  providers: [firebaseService, dataService],
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

  @Input() compactMode = false; // compact mode for dashboard.

  dataSource;
  columnsToDisplay = ['location', 'id', 'timestamp', 'sensorData'];
  expandedElement: SensorUnits | null;
  extraAllowance = 0.1; // amount you can go over sensorMin and sensorMax before getting a sad smiley.
  sensorDataCollectioPath = 'sensorData';

  constructor(public dialog: MatDialog, private firebaseServ: firebaseService, public dataServ: dataService) {
  }

  ngOnInit(): void {
    this.checkForCompactMode();
    this.getLiveDataFromDB();
  }

  checkForCompactMode() {
    if (this.compactMode) {
      this.columnsToDisplay = ['location', 'id', 'timestamp'];
    }
  }

  getLiveDataFromDB() {
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
    for (let sensorData of this.dataServ.createArrayFromObject(sensorRowData.sensorData)){
      for (let sensor of sensorData.data) {
        let sr = this.dataServ.getSafetyRating(sensor.sensorType, sensor.sensorValue);
        sensor.safetyRating = sr;
        sensor.safetyColor = this.dataServ.getSafetyColorCode(sr);
      }
    }
    return sensorRowData;
  }
}
