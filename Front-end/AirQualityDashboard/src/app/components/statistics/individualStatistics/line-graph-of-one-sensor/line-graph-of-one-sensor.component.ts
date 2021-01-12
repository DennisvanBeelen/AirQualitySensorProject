import {Component, Input, OnInit, OnChanges, ViewChild} from '@angular/core';
import {dataService} from "../../../../services/dataService";
import { ChartComponent } from 'angular2-chartjs';


@Component({
  selector: 'app-line-graph-of-one-sensor',
  templateUrl: './line-graph-of-one-sensor.component.html',
  styleUrls: ['./line-graph-of-one-sensor.component.scss']
})
export class LineGraphOfOneSensorComponent implements OnInit, OnChanges {

  @ViewChild(ChartComponent) chart: ChartComponent;


  @Input() sensorData;
  @Input() currentSensorUnit = 1;
  @Input() currentSensor = 1;

  dataLocation = 0;
  wantedLength = 50;

  locationOfDataLineInGraph = 0;
  locationOfMinimumLineInGraphData = 1;
  locationOfMaximumLineInGraphData = 2;
  minimumValueToDrawLine = 0.25;
  maximumValueToDrawLine = 2;

  titleText= "";

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
    title: {display: false, text: this.wantedLength + ' measurements chart.'},
  };


  constructor(private dataService: dataService) {
  }

  ngOnChanges():void{
    console.log("new data arrived");
    this.populateGraph();
    if (this.chart){
      this.chart.chart.update();
    }

  }

  ngOnInit(): void {
    this.setMinMaxLineValues();
    this.populateGraph();
    this.setLabel();
  }


  private populateGraph() {
    this.clearGraph();
    let sortedData = LineGraphOfOneSensorComponent.sortArrayOnTimestamp(this.sensorData[this.currentSensorUnit].sensorData);
    sortedData = LineGraphOfOneSensorComponent.cutArrayToWantedSize(sortedData, this.wantedLength);

    for (let i = 0; i < sortedData.length; i++) {
      this.data.labels.push(this.dataService.createReadableTimestamp(sortedData[i].timestamp));
      this.data.datasets[this.dataLocation].data.push(sortedData[i].data[this.currentSensor].sensorValue);
      this.addMinMaxValues(i);
    }
  }

  private clearGraph(){
    this.data.labels = [];
    this.data.datasets[this.dataLocation].data = [];
    this.data.datasets[this.locationOfMinimumLineInGraphData].data = [];
    this.data.datasets[this.locationOfMaximumLineInGraphData].data = [];
  }


  private static sortArrayOnTimestamp(array) {
    return array.sort(function (a, b) {
      return a.timestamp - b.timestamp
    });
  }

  private static cutArrayToWantedSize(array, wantedLength) {
    if (array.length > wantedLength) {
      let amountToLong = array.length - wantedLength;
      array.splice(0, amountToLong);
    }
    return array;
  }

  private addMinMaxValues(i: number) {
    this.data.datasets[this.locationOfMinimumLineInGraphData].data.push(this.minimumValueToDrawLine);
    this.data.datasets[this.locationOfMaximumLineInGraphData].data.push(this.maximumValueToDrawLine);
  }

  setMinMaxLineValues(){
    let sensorType = this.dataService.getCorrectSensorType(this.sensorData[this.currentSensorUnit].sensorData[0].data[this.currentSensor].sensorType);
    this.minimumValueToDrawLine = sensorType.minimalValue;
    this.maximumValueToDrawLine = sensorType.maximumValue;
  }

  private setLabel() {
    let type = this.sensorData[this.currentSensorUnit].sensorData[0].data[this.currentSensor].sensorType;
    this.data.datasets[this.locationOfDataLineInGraph].label = type;
    this.titleText = this.wantedLength + ' latest ' + type + ' measurements.';
  }
}
