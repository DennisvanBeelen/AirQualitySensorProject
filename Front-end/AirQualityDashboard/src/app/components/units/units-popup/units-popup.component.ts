import {Component, EventEmitter, Inject, OnInit, Output, ViewChild, AfterViewInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {MatDialog} from "@angular/material/dialog";
import {InformationPopupComponent} from "../../information/information-popup/information-popup.component";
import {SensorType} from "../../../interfaces";
import {dataService} from "../../../services/dataService";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-units-popup',
  providers: [ dataService],
  templateUrl: './units-popup.component.html',
  styleUrls: ['./units-popup.component.scss']
})
export class UnitsPopupComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public dataServ: dataService,private cdref: ChangeDetectorRef) {
  }
  dataSource;
  columnsToDisplay = ['timestamp', 'sensorData'];


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.dataServ.createArrayFromObject(this.data.sensorData));
  }

  sensorClicked(sensor: any) {
    console.log(sensor.sensorType.toUpperCase().replace(' ', ''))
    this.openPopup(SensorType[sensor.sensorType.toUpperCase().replace(' ', '')])
  }

  openPopup(sensorRowData) {
    this.dialog.open(InformationPopupComponent, {data: sensorRowData});
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.sort.sort({id:'timestamp', start: 'desc', disableClear: false});
    this.cdref.detectChanges();
  }
}
