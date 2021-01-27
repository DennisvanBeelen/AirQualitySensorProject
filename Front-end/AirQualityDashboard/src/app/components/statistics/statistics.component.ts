import {Component, OnInit} from '@angular/core';
import {firebaseService} from '../../services/firebaseService';
import {dataService} from '../../services/dataService';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-statistics',
    providers: [firebaseService, dataService],
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

    sensorDataCollectioPath = 'sensorData';
    sensorData = [];
    selectedUnit = {location: '', id: '', index: null};

    wantedLength = 50;
    sensorNumbers = [0, 1, 2, 3, 4, 5, 6];

    constructor(private firebaseServ: firebaseService, private dataService: dataService) {
    }

    ngOnInit(): void {
        this.getLiveDataFromDB();
    }

    getLiveDataFromDB() {
        this.firebaseServ.getLiveCollectionFromFirebase(this.sensorDataCollectioPath).subscribe(data => {
            if (this.sensorData.length < data.length) {
                this.initSensorData(data)
            }

            this.updateStatisticsData(data);
            this.unitSelected({index: 0});
        });
    }

    initSensorData(firebaseData) {
        this.sensorData = [];
        for (let i = 0; i < firebaseData.length; i++) {
            this.sensorData.push({id: firebaseData[i].payload.doc.data().id,location: firebaseData[i].payload.doc.data().location ,sensorData: new BehaviorSubject([])})
        }
    }

    updateStatisticsData(data) {
        for (let i = 0; i < data.length; i++) {

            const dataArray = this.createDataArray(data[i].payload.doc.data().sensorData);

            if (this.sensorData[i].sensorData.getValue() !== dataArray) {
                this.sensorData[i].sensorData.next(dataArray)
            }
        }
    }

    createDataArray(sensorDataArray) {
        let dataArray = this.dataService.createArrayFromObject(sensorDataArray);
        dataArray = this.dataService.sortArrayOnTimestamp(dataArray);
        dataArray = this.dataService.cutArrayToWantedSize(dataArray, this.wantedLength);

        return dataArray
    }

    unitSelected(tab) {
        this.selectedUnit.location = this.sensorData[tab.index].location;
        this.selectedUnit.id = this.sensorData[tab.index].id;
        this.selectedUnit.index = tab.index;
    }

    CL(tab) {
        console.log(tab);
    }


}
