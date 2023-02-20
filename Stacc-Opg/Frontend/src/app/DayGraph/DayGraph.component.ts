import { Component } from '@angular/core';

import { ConsumptionService } from '../Services/consumption.service';
import { Consumption } from '../Consumption';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-DayGraph',
  templateUrl: './DayGraph.component.html',
  styleUrls: ['./DayGraph.component.scss'],
})
export class DayGraphComponent {
  title = 'Consumption chart';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Consumption',
        fill: true,
        tension: 0.5,
        borderColor: 'green',
        backgroundColor: 'rgba(50,200,50,0.3)',
      },
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
  };
  public lineChartLegend = true;

  public consumptions: Consumption[] = [];
  line: any;

  constructor(private consumptionService: ConsumptionService) {}

  ngOnInit() {
    let i = 0;
    this.consumptionService.getConsumption().subscribe((data: any) => {
      this.consumptions = data.map(
        (item: any) =>
          new Consumption(
            item.from,
            item.to,
            item.consumption,
            item.consumptionUnit
          )
      );
      this.ConvertToDays();
      this.lineChartData.labels = this.toDays.map((day) =>
        day[0].from.toLocaleDateString()
      );
      this.lineChartData.datasets[0].data = this.toDays.map(
        (day) =>
          day.reduce((sum, consumption) => sum + consumption.consumption, 0) /
          day.length
      );
    });
  }
  /**
   * Convert initial input to be the consumption of a day
   */
  toDays: Consumption[][] = [];
  ConvertToDays() {
    let date: number | null = null;
    let day: Consumption[] = [];
    this.consumptions.forEach((x) => {
      if (date == null) {
        date = x.from.getDate();
      }
      if (x.from.getDate() != date) {
        this.toDays.push(day);
        day = [];
        date = x.from.getDate();
      }
      day.push(x);
    });
    this.toDays.push(day);
  }
  /**
   * Sort the hours, will be used for the average consumption throughout the day
   */
  toHours: Consumption[][] = [];
  ConvertToHours() {
    this.toHours = [];
    for (let i = 0; i < 24; i++) {
      this.toHours[i] = [];
    }
    this.consumptions.forEach((x) => {
      let h = x.from.getHours();
      this.toHours[h].push(x);
    });
    console.log(this.toHours);
  }
}
