import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {firebaseService} from "../../services/firebaseService";
import {dataService} from "../../services/dataService";

@Component({
  selector: 'app-statistics',
  providers: [firebaseService, dataService],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  sensorDataCollectioPath = 'sensorData';
  sensorData;


  constructor(private firebaseServ: firebaseService,private dataService: dataService) {
  }

  ngOnInit(): void {
    this.getLiveDataFromDB();
  }

  getLiveDataFromDB() {
    this.firebaseServ.getLiveCollectionFromFirebase(this.sensorDataCollectioPath).subscribe(data => (this.sensorData = this.createStatData(data)));
  }

  createStatData(data) {
    let newData = [];
    for (let i = 0; i < data.length; i++){
      newData.push(data[i].payload.doc.data());
      newData[i].sensorData = this.dataService.createArrayFromObject(data[i].payload.doc.data().sensorData);
    }
    return newData
  }
}
