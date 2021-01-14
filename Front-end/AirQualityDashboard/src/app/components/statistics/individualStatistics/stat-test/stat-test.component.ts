import {Component, Input, OnInit} from '@angular/core';
import {dataService} from "../../../../services/dataService";


@Component({
  selector: 'app-stat-test',
  providers: [dataService],
  templateUrl: './stat-test.component.html',
  styleUrls: ['./stat-test.component.scss']
})
export class StatTestComponent implements OnInit {
  @Input() sensorData;

  currentSensorUnit = 1;
  currentSensor = 1;

  dataLocation = 0;
  wantedLength = 50;

  locationOfDataLineInGraph = 0;
  locationOfMinimumLineInGraphData = 1;
  locationOfMaximumLineInGraphData = 2;
  minimumValueToDrawLine = 0.25;
  maximumValueToDrawLine = 2;
  minimumGraphSize = 0;
  maximumGraphSize = 2.4;




  type = 'line';
  data = {
    labels: [],
    datasets: [
      {
        label: "NULL",
        data: [],
        borderColor: ['rgba(0, 0, 0, 0.6)'],
        backgroundColor: ['rgba(0,0,0,0)'],
      },
      {
        label: "Minimum",
        data: [],
        borderColor: ['rgba(249, 16, 16, 0.5)'],
        backgroundColor: ['rgba(0,0,0,0)'],
        pointStyle: 'line'
      },
      {
        label: "Maximum",
        data: [],
        borderColor: ['rgba(249, 16, 16, 0.5)'],
        backgroundColor: ['rgba(0,0,0,0)'],
        pointStyle: 'line'

      }
    ]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false,
    title: {display: true, text: this.wantedLength + ' measurements chart.'},
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: this.minimumGraphSize,
          suggestedMax: this.maximumGraphSize

        }
      }]
    }
  };


  constructor(private dataService: dataService) {
  }

  ngOnInit(): void {
    // this.populateGraph();
    // this.setLabel();
  }

  CL() {
    console.log(this.sensorData);
  }

  // private populateGraph() {
  //   let sortedData = StatTestComponent.sortArrayOnTimestamp(this.sensorData[this.currentSensorUnit].sensorData);
  //   sortedData = StatTestComponent.cutArrayToWantedSize(sortedData, this.wantedLength);
  //
  //   for (let i = 0; i < sortedData.length; i++) {
  //     this.data.labels.push(this.dataService.createReadableTimestamp(sortedData[i].timestamp));
  //     this.data.datasets[this.dataLocation].data.push(sortedData[i].data[this.currentSensor].sensorValue);
  //     this.addMinMaxValues(i);
  //   }
  // }
  //
  // private static sortArrayOnTimestamp(array) {
  //   return array.sort(function (a, b) {
  //     return a.timestamp - b.timestamp
  //   });
  // }
  //
  // private static cutArrayToWantedSize(array, wantedLength) {
  //   if (array.length > wantedLength) {
  //     let amountToLong = array.length - wantedLength;
  //     array.splice(0, amountToLong);
  //   }
  //   return array;
  // }
  //
  // private addMinMaxValues(i: number) {
  //   this.data.datasets[this.locationOfMinimumLineInGraphData].data.push(this.minimumValueToDrawLine);
  //   this.data.datasets[this.locationOfMaximumLineInGraphData].data.push(this.maximumValueToDrawLine);
  // }
  //
  // private setLabel() {
  //   let type = this.sensorData[this.currentSensorUnit].sensorData[0].data[this.currentSensor].sensorType
  //   this.data.datasets[this.locationOfDataLineInGraph].label = type;
  //   this.options.title.text = this.wantedLength + ' latest ' + type +' measurements chart.'
  // }
}
