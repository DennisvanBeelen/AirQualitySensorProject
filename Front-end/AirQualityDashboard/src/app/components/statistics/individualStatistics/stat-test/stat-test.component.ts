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
  type = 'line';
  data = {
    labels: [],
    datasets: [
      {
        label: "My First dataset",
        data: []
      }
    ]
  };
  options = {responsive: true, maintainAspectRatio: false};


  constructor(private dataService: dataService) {
  }

  ngOnInit(): void {
    this.test()
  }

  test() {
    console.log(this.sensorData[0].sensorData);
    this.sensorData[0].sensorData = this.sortArrayOnTimestamp(this.sensorData[0].sensorData);
    console.log(this.sensorData[0].sensorData);
    for (let i = 0; i<this.sensorData[0].sensorData.length ;i++){
      this.data.labels.push(this.dataService.createReadableTimestamp(this.sensorData[0].sensorData[i].timestamp)); // readable timestamp
      this.data.datasets[0].data.push(this.sensorData[0].sensorData[i].data[1].sensorValue); // Co2 value
    }
  }

  sortArrayOnTimestamp(array){
    return array.sort(function(a, b){return a.timestamp - b.timestamp});
  }
}
