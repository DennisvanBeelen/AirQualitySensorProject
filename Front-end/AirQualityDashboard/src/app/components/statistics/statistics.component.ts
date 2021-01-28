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

    graphWantedLength = 50;
    sensorNumbers = [];

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

            this.sensorData.push({id: firebaseData[i].payload.doc.data().id,location: firebaseData[i].payload.doc.data().location , sensorNumbers: [],sensorData: new BehaviorSubject([])})
        }
    }

    updateStatisticsData(data) {
        for (let i = 0; i < data.length; i++) {

            const dataArray = this.createDataArray(data[i].payload.doc.data().sensorData);

            if (this.sensorData[i].sensorData.getValue() !== dataArray) {
                this.setNumberOfSensors(i, dataArray);

                this.sensorData[i].sensorData.next(dataArray)
            }
        }
    }

    createDataArray(sensorDataArray) {
        let dataArray = this.dataService.createArrayFromObject(sensorDataArray);
        dataArray = this.dataService.sortArrayOnTimestamp(dataArray);

        return dataArray
    }

    setNumberOfSensors(unitIndex: number, unitData) {
        const numberOfSensors = unitData[unitIndex].data.length;
        this.sensorData[unitIndex].sensorNumbers = Array.from({length: numberOfSensors}, (_, index) => index);
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
