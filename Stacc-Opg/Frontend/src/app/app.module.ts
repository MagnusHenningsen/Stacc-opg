import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule} from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { DayGraphComponent } from './DayGraph/DayGraph.component';
import { HourlyGraphComponent } from './hourly-graph/hourly-graph.component';
import { DayOfWeekComponent } from './day-of-week/day-of-week.component';
import { ProvidersComponent } from './providers/providers.component';
import { BestoptionsComponent } from './bestoptions/bestoptions.component';


@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    HomeComponent,
    DayGraphComponent,
    HourlyGraphComponent,
    DayOfWeekComponent,
    ProvidersComponent,
    BestoptionsComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
