import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {of, range, Subject} from 'rxjs';
import {dataService} from '../../../../services/dataService';
import {concatMap, delay, takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-gauge',
    templateUrl: './gauge.component.html',
    styleUrls: ['./gauge.component.scss']
})
export class GaugeComponent implements OnInit, OnDestroy {

    @Input() sensorData;
    @Input() currentSensor;
    @Input() currentSensorUnit;

    colors = ['#F44336', '#FFEB3B', '#4CAF50', '#FFEB3B', '#F44336'];
    boundaries: number[];

    @ViewChild('gaugeCanvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D;

    doneSetup = false;
    sensorType;
    gaugeValue: number = 0;
    gaugeMax: number = 0;
    gaugeMin: number = 0;

    canvasBaseData;
    baseDataX: number;
    baseDataY: number;

    width: number;
    height: number;
    centerX: number;
    centerY: number;
    radius: number;
    currentPercent: number = 0;

    gaugeAnimationSub;
    stopSubscription = new Subject();

    constructor(private dataService: dataService) {
    }

    ngOnInit(): void {
        this.setupSensorInfo();
        this.setupCanvas();
        this.setupGaugeBody();

        this.setupValue();

        this.doneSetup = true;
    }

    ngOnDestroy() {
        this.stopSubscription.next(true);
    }

    setupCanvas() {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.ctx.imageSmoothingEnabled = true;
        this.width = this.canvas.nativeElement.width;
        this.height = this.canvas.nativeElement.height;

        this.centerX = this.width / 2;
        this.centerY = this.height / 4 * 3;
        this.radius = this.canvas.nativeElement.width / 2.5;
    }

    setupSensorInfo() {
        let sensorType = this.dataService.getCorrectSensorType(this.sensorData[this.currentSensorUnit].sensorData.getValue()[0].data[this.currentSensor].sensorType);

        this.colors = sensorType.gaugeColors;
        this.boundaries = sensorType.gaugeBoundaries;
        this.sensorType = sensorType.name;

        this.gaugeMin = this.boundaries[0];
        this.gaugeMax = this.boundaries[this.boundaries.length - 1];

    }

    setupGaugeBody() {
        this.drawGaugeBody(this.boundaries, this.colors);
        this.drawPointerBase();
        this.saveGauge();
    }

    drawGaugeBody(boundaries: number[], colors: string[]) {
        let endingPercent;
        let startingAngle = 1;
        let endingAngle = 0;
        let boundaryRange = boundaries[boundaries.length - 1] - boundaries[0];

        for (let boundaryIndex = 0; boundaryIndex < boundaries.length; boundaryIndex++) {
            if (boundaries.length - 1 === boundaryIndex) {
                break
            }

            endingPercent = (boundaries[boundaryIndex + 1] - boundaries[boundaryIndex]) / boundaryRange;
            endingAngle = endingPercent;

            this.ctx.beginPath();
            this.ctx.strokeStyle = colors[boundaryIndex];
            this.ctx.lineWidth = 10;

            this.ctx.arc(this.centerX, this.centerY, this.radius, startingAngle * Math.PI,
                (endingAngle + startingAngle) * Math.PI);

            this.ctx.stroke();
            this.ctx.closePath();

            startingAngle += endingAngle;
        }
    }

    drawPointerBase() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#222';
        this.ctx.fillStyle = '#222';
        this.ctx.lineWidth = 4;

        this.ctx.arc(this.centerX, this.centerY, 6, 0,
            2 * Math.PI);

        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
    }

    saveGauge() {
        this.baseDataX = this.centerX - this.radius - 10;
        this.baseDataY = this.centerY - this.radius - 10;
        this.canvasBaseData = this.ctx.getImageData(this.baseDataX, this.baseDataY, this.width, this.height);
    }

    setupValue() {
        this.sensorData[this.currentSensorUnit].sensorData.pipe(takeUntil(this.stopSubscription)).subscribe(data => {
            this.setPointerValue(data);
        })
    }

    setPointerValue(firebaseData) {
        let combinedValues = 0;

        for (let i = 0; i < firebaseData.length; i++) {
            combinedValues += parseInt(firebaseData[i].data[this.currentSensor].sensorValue);
        }

        this.gaugeValue = combinedValues / firebaseData.length;
        this.updatePointer()
    }


    update(e) {
        if (e.key == 'Enter') {
            this.updatePointer();
        }
    }

    updatePointer() {
        if (!this.gaugeValue) {
            return;
        }


        const percent = Math.round(((this.gaugeValue - this.gaugeMin) / (this.gaugeMax - this.gaugeMin)) * 100);
        let percentDifference = percent - this.currentPercent;

        percentDifference = Math.min(100, percentDifference);
        percentDifference = Math.max(-100, percentDifference);

        if (percentDifference === 0 || isNaN(percentDifference)) {
            return;
        }

        const isDirectionPositive = percentDifference > 0;

        if (this.gaugeAnimationSub) {
            this.gaugeAnimationSub.unsubscribe();
        }

        this.gaugeAnimationSub = range(1, Math.abs(percentDifference)).pipe(takeUntil(this.stopSubscription),
            concatMap(i => of(i).pipe(delay(10)))
        ).subscribe(val => {
            if (isDirectionPositive) {
                this.drawPointer(this.currentPercent + val, true);
                if (val === percentDifference) {
                    this.currentPercent = Math.min(100, this.currentPercent + percentDifference);
                }
            } else {
                this.drawPointer(this.currentPercent - val, true);
                if (-1 * val === percentDifference) {
                    this.currentPercent = Math.max(0, this.currentPercent + percentDifference);
                }
            }
        });
    }

    drawPointer(percent: number, refresh?: boolean) {
        if (refresh) {
            this.ctx.putImageData(this.canvasBaseData, this.baseDataX, this.baseDataY);
        }
        this.drawPointerArm(percent);
    }

    drawPointerArm(percent: number) {
        if (percent > 100) {
            percent = 100
        }

        if (percent < 0) {
            percent = 0
        }

        const degree = percent * 1.8;
        const pointerBaseRadius = 6;

        const targetX = Math.round((this.radius - 5) * Math.sin((-1 * degree - 90) * (Math.PI / 180))) + this.centerX;
        const targetY = Math.round((this.radius - 5) * Math.cos((-1 * degree - 90) * (Math.PI / 180))) + this.centerY;

        const startX = Math.round(pointerBaseRadius * Math.sin((-1 * degree) * Math.PI / 180)) + this.centerX;
        const startY = Math.round(pointerBaseRadius * Math.cos((-1 * degree) * Math.PI / 180)) + this.centerY;

        const endX = Math.round(pointerBaseRadius * Math.sin((-1 * degree - 180) * Math.PI / 180)) + this.centerX;
        const endY = Math.round(pointerBaseRadius * Math.cos((-1 * degree - 180) * Math.PI / 180)) + this.centerY;

        this.ctx.beginPath();
        this.ctx.strokeStyle = '#222';
        this.ctx.fillStyle = '#222';
        this.ctx.lineWidth = 2;

        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(targetX, targetY);
        this.ctx.lineTo(endX, endY);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }

}
