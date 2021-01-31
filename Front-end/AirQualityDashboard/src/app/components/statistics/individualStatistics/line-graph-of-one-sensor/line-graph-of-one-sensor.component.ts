import {Component, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {dataService} from '../../../../services/dataService';
import {ChartComponent} from 'angular2-chartjs';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


@Component({
    selector: 'app-line-graph-of-one-sensor',
    templateUrl: './line-graph-of-one-sensor.component.html',
    styleUrls: ['./line-graph-of-one-sensor.component.scss']
})
export class LineGraphOfOneSensorComponent implements OnInit, OnDestroy {

    @ViewChild(ChartComponent) chart: ChartComponent;


    @Input() sensorData;
    @Input() currentSensorUnit = 1;
    @Input() currentSensor = 1;
    @Input() wantedLength = 50;

    dataLocation = 0;

    locationOfDataLineInGraph = 0;
    locationOfMovingAverageLineInGraphData = 1;
    locationOfMaximumLineInGraphData = 2;

    minimumValueToDrawLine = 0.25;
    maximumValueToDrawLine = 2;

    movingAverageSteps = 3;

    stopSubscription = new Subject();

    titleText = '';

    type = 'line';
    data = {

        labels: [],
        datasets: [
            {
                label: 'NULL',
                data: [],
                backgroundColor: '#d5c8ea',
                borderColor: '#000000',
                borderWidth: 1,
                type: 'bar',
                order: 4
            },
            {
                label: 'MovingAverage',
                data: [],
                borderColor: '#6098c2',
                type: 'line',
                pointStyle: 'line',
                order: 1
            },
            {
                label: 'Max',
                data: [],
                borderColor: 'rgba(240, 52, 52, .1)',
                backgroundColor: 'rgba(42, 187, 155, .1)',
                type: 'line',
                pointStyle: 'line',
                order: 1
            }
        ]
    };
    options = {
      scales: { yAxes: [{ticks: {min:0}}]},
      responsive: true,
      maintainAspectRatio: false,
      title: {display: false, text: this.wantedLength + ' measurements chart.'}
    };


    constructor(private dataService: dataService) {
    }



    ngOnDestroy(): void {
        this.stopSubscription.next(true)
    }

    ngOnInit(): void {
        this.setMinMaxLineValues();
        this.setupGraph();
        this.setLabel();
    }

    setupGraph() {
        this.sensorData[this.currentSensorUnit].sensorData.pipe(takeUntil(this.stopSubscription)).subscribe(data => {
            this.populateGraph(data);
            if (this.chart) {
                this.chart.chart.update();
            }
        })
    }


    private populateGraph(sensorData) {
        this.clearGraph();
        sensorData = this.dataService.cutArrayToWantedSize(sensorData, this.wantedLength);

        for (let i = 0; i < sensorData.length; i++) {
            this.data.labels.push(this.dataService.createReadableTimestamp(sensorData[i].timestamp));
            this.data.datasets[this.dataLocation].data.push(sensorData[i].data[this.currentSensor].sensorValue);
            this.addMinMaxValues(i);
        }
        this.createMovingAverageLine(this.data.datasets[this.dataLocation].data);
    }

    private clearGraph() {
        this.data.labels = [];
        this.data.datasets[this.dataLocation].data = [];
        this.data.datasets[this.locationOfMovingAverageLineInGraphData].data = [];
    }

    private addMinMaxValues(i: number) {
        this.options.scales.yAxes[0].ticks.min = this.minimumValueToDrawLine;
        this.data.datasets[this.locationOfMaximumLineInGraphData].data.push(this.maximumValueToDrawLine)
    }

    createMovingAverageLine(sensorData) {
        const movingAverageDataSet = this.dataService.getMovingAverage(sensorData, this.movingAverageSteps);
        this.data.datasets[this.locationOfMovingAverageLineInGraphData].data = movingAverageDataSet;
    }

    setMinMaxLineValues() {
        let sensorType = this.dataService.getCorrectSensorType(this.sensorData[this.currentSensorUnit].sensorData.getValue()[0].data[this.currentSensor].sensorType);
        this.minimumValueToDrawLine = sensorType.minimalValue;
        if (this.minimumValueToDrawLine > 5 && this.minimumValueToDrawLine < 900) {
          this.minimumValueToDrawLine -= 10;
        }
        this.maximumValueToDrawLine = sensorType.maximumValue;
    }

    private setLabel() {
        let type = this.sensorData[this.currentSensorUnit].sensorData.getValue()[0].data[this.currentSensor].sensorType;
        this.data.datasets[this.locationOfDataLineInGraph].label = type;
        this.titleText = this.wantedLength + ' latest ' + type + ' measurements.';
    }
}
