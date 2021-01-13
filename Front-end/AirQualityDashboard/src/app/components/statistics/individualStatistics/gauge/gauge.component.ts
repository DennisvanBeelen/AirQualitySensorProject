import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
    selector: 'app-gauge',
    templateUrl: './gauge.component.html',
    styleUrls: ['./gauge.component.scss']
})
export class GaugeComponent implements OnInit {

    @Input() sensorData;
    ctx: CanvasRenderingContext2D;
    @ViewChild('gaugeCanvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;

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
    pointerPercent: number;

    constructor() {
    }

    ngOnInit(): void {
        console.log(this.sensorData);


        const boundaries = [0, 25, 50, 75, 80, 100];

        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.ctx.imageSmoothingEnabled = true;
        this.width = this.canvas.nativeElement.width;
        this.height = this.canvas.nativeElement.height;

        this.centerX = this.width / 2;
        this.centerY = this.height / 4 * 3;
        this.radius = this.canvas.nativeElement.width / 4;


        this.drawGaugeBody(boundaries, ['#F44336', '#4CAF50', '#F44336', '#4CAF50', '#F44336']);

        this.drawPointer(0, false);

        this.gaugeMin = boundaries[0];
        this.gaugeMax = boundaries[boundaries.length - 1];
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

        this.saveGaugeBody();
    }

    saveGaugeBody() {
        this.baseDataX = this.centerX - this.radius - 10;
        this.baseDataY = this.centerY - this.radius - 10;
        this.canvasBaseData = this.ctx.getImageData(this.baseDataX, this.baseDataY, this.width, this.height);
    }

    up() {
        this.pointerPercent++;
        this.drawPointer(this.pointerPercent, true);
    }

    down() {
        this.pointerPercent--;
        this.drawPointer(this.pointerPercent, true);
    }

    run() {
        this.pointerPercent = 0;
        for (let i = 0; i < 100 * 4; i++) {
            this.pointerPercent += 0.25;
            debugger
            this.drawPointer(this.pointerPercent, true)
        }
    }

    drawPointer(percent: number, refresh?: boolean) {
        if (refresh) {
            this.ctx.putImageData(this.canvasBaseData, this.baseDataX, this.baseDataY);
        }
        this.drawPointerBase(percent);
        this.drawPointerArm();
    }

    drawPointerBase(percent: number) {
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

    drawPointerArm() {
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

}
