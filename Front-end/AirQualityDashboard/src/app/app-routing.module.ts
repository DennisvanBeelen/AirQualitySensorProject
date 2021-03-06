import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from './components/home-page/home-page.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {InformationComponent} from './components/information/information.component';
import {StatisticsComponent} from './components/statistics/statistics.component';
import {UnitsComponent} from './components/units/units.component';
import {PageNotFoundComponent} from './components/extraComponents/page-not-found/page-not-found.component';

const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: '', component: HomePageComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'information', component: InformationComponent},
  {path: 'statistics', component: StatisticsComponent},
  {path: 'units', component: UnitsComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
