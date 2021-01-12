import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {environment} from "../environments/environment";
import {AngularFireModule} from "@angular/fire";
import {AngularFirestoreModule} from "@angular/fire/firestore";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {HomePageComponent} from './components/home-page/home-page.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {UnitsComponent} from './components/units/units.component';
import {StatisticsComponent} from './components/statistics/statistics.component';
import {InformationComponent} from './components/information/information.component';
import {PageNotFoundComponent} from './components/extraComponents/page-not-found/page-not-found.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatTableModule} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {UnitsPopupComponent} from './components/units/units-popup/units-popup.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";
import {InformationDisplayComponent} from './components/information/information-display/information-display.component';
import {MatCardModule} from "@angular/material/card";
import {InformationPopupComponent} from './components/information/information-popup/information-popup.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatSortModule} from "@angular/material/sort";
import {MatChipsModule} from "@angular/material/chips";
import {MatListModule} from "@angular/material/list";
import { StatTestComponent } from './components/statistics/individualStatistics/stat-test/stat-test.component';
import {ChartModule} from "angular2-chartjs";
import { LineGraphOfOneSensorComponent } from './components/statistics/individualStatistics/line-graph-of-one-sensor/line-graph-of-one-sensor.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    DashboardComponent,
    UnitsComponent,
    StatisticsComponent,
    InformationComponent,
    PageNotFoundComponent,
    UnitsPopupComponent,
    InformationDisplayComponent,
    InformationPopupComponent,
    StatTestComponent,
    LineGraphOfOneSensorComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatSortModule,
    MatChipsModule,
    MatListModule,
    ChartModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {
}
