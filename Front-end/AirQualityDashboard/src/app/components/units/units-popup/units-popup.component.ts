import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {InformationPopupComponent} from '../../information/information-popup/information-popup.component';
import {SensorType} from '../../../interfaces';
import {dataService} from '../../../services/dataService';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';


@Component({
    selector: 'app-units-popup',
    providers: [dataService],
    templateUrl: './units-popup.component.html',
    styleUrls: ['./units-popup.component.scss']
})
export class UnitsPopupComponent implements OnInit, AfterViewInit {

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('exportDataLink', {static: false}) exportDataLink: ElementRef<HTMLLinkElement>;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public dataServ: dataService, private cdref: ChangeDetectorRef) {
    }

    dataSource;
    columnsToDisplay = ['timestamp', 'sensorData'];
    exportingData = false;

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.dataServ.createArrayFromObject(this.data.sensorData));
    }

    sensorClicked(sensor: any) {
        console.log(sensor.sensorType.toUpperCase().replace(' ', ''))
        this.openPopup(SensorType[sensor.sensorType.toUpperCase().replace(' ', '')])
    }

    async exportDataClicked() {
        this.exportingData = true;
        const base64DataString = await this.formatDataAsCSV(this.data.sensorData);
        this.downloadExportedData(base64DataString);
    }

    async formatDataAsCSV(data) {
        let CSVString = '';
        if (data === null) {
            return '';
        }
        for (let row in data) {
            const timestamp = data[row].timestamp.seconds;
            for (let sensor of data[row].data) {
                CSVString += `${timestamp},${sensor.sensorName},${sensor.sensorType},${sensor.sensorValue},${sensor.sensorDataUnit}\n`
            }
        }
        return CSVString
    }

    downloadExportedData(base64DataString: string) {
        this.exportDataLink.nativeElement.href = 'data:text;base64,' + window.btoa(base64DataString);

        this.exportDataLink.nativeElement.click();
        this.exportingData = false;
        this.exportDataLink.nativeElement.href = '#';
    }

    openPopup(sensorRowData) {
        this.dialog.open(InformationPopupComponent, {data: sensorRowData});
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
        this.sort.sort({id: 'timestamp', start: 'desc', disableClear: false});
        this.cdref.detectChanges();
    }
}
