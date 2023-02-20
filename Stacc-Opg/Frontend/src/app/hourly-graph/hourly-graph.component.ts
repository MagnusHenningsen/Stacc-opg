import { Component } from '@angular/core';

import { ConsumptionService } from '../Services/consumption.service';
import { Consumption } from '../Consumption';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-hourly-graph',
  templateUrl: './hourly-graph.component.html',
  styleUrls: ['./hourly-graph.component.scss'],
})
export class HourlyGraphComponent {
  title = 'Average Consumption (Hour)';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Consumption',
        fill: true,
        tension: 0.5,
        borderColor: 'rgba(50,50,200,0.3)',
        backgroundColor: 'rgba(50,50,200,0.3)',
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
      this.ConvertToHours();
      this.lineChartData.labels = this.ToHours.map((hour) => {
        let h = hour[0].from
          .getHours()
          .toLocaleString('en-GB', { minimumIntegerDigits: 2 });
        let m = hour[0].from
          .getMinutes()
          .toLocaleString('en-GB', { minimumIntegerDigits: 2 });
        return `Kl: ${h}:${m}`;
      });
      this.lineChartData.datasets[0].data = this.ToHours.map((hour) => {
        return hour.reduce((sum, consumption) => sum + consumption.consumption, 0) / hour.length;
      });
    });
  }
  /**
   * Sort the hours, will be used for the average consumption throughout the day
   */
  ToHours: Consumption[][] = [];
  ConvertToHours() {
    this.ToHours = [];
    for (let i = 0; i < 24; i++) {
      this.ToHours[i] = [];
    }
    this.consumptions.forEach((x) => {
      let h = x.from.getHours();
      this.ToHours[h].push(x);
    });
    console.log(this.ToHours);
  }
}
