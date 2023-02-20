import { Component } from '@angular/core';

import { ConsumptionService } from '../Services/consumption.service';
import { Consumption } from '../Consumption';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent {
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
        backgroundColor: 'rgba(255,0,0,0.3)',
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
      console.log(this.toDays);
      this.lineChartData.labels = this.toDays.map(
        (day) => day[0].from.toLocaleDateString()
      );
      this.lineChartData.datasets[0].data = this.toDays.map((day) =>
        day.reduce((sum, consumption) => sum + consumption.consumption, 0) / day.length
      );
    });
  }
  toDays: Consumption[][] = [];
  ConvertToDays() {
    let date: number | null = null;
    let day: Consumption[] = [];
    this.consumptions.forEach((x) => {
      if (date == null) {
        date = x.from.getDate();
      }
      if (x.from.getDate() != date) {
        const avgConsumption =
          day.reduce((sum, consumption) => sum + consumption.consumption, 0) /
          day.length;
        this.toDays.push(day);
        day = [];
        console.log("New day " + x.from.getDate() + " - " + date);
        date = x.from.getDate();
      }
      day.push(x);
    });
    // Calculate the average consumption for the last day
    const avgConsumption =
      day.reduce((sum, consumption) => sum + consumption.consumption, 0) /
      day.length;
    this.toDays.push(day);
  }
}
