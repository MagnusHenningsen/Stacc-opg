import { Component, ViewChild } from '@angular/core';
import { ConsumptionService } from '../Services/consumption.service';
import { Consumption } from '../Consumption';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-hourly-graph',
  templateUrl: './hourly-graph.component.html',
  styleUrls: ['./hourly-graph.component.scss'],
})
export class HourlyGraphComponent {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  title = 'Average Consumption (Hour)';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Average By Hour',
        fill: true,
        tension: 0.5,
        borderColor: 'rgb(50,50,200)',
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
  highestConsumptions: { from: string; to: string; consumption: string }[] = [];
  lowestConsumptions: { from: string; to: string; consumption: string }[] = [];

  constructor(private consumptionService: ConsumptionService) {}

  ngOnInit() {
    /**
     * Gathers the data from api, sets up data format for graph it for visualization
     */
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
      this.consumptionService.HoursArr = this.ToHours;
      // collect labels 
      this.lineChartData.labels = this.ToHours.map((hour) => {
        let h = hour[0].from
          .getHours()
          .toLocaleString('en-GB', { minimumIntegerDigits: 2 });
        let m = hour[0].from
          .getMinutes()
          .toLocaleString('en-GB', { minimumIntegerDigits: 2 });
        return `Kl: ${h}:${m}`;
      });
      // set data
      this.lineChartData.datasets[0].data = this.ToHours.map((hour) => {
        return (
          hour.reduce((sum, consumption) => sum + consumption.consumption, 0) /
          hour.length
        );
      });
      // update chart
      if (this.chart && this.chart.chart) {
        this.chart.chart.update();
      }
      const hourlyConsumptions = this.ToHours.map((hour) => ({
        from: hour[0].from,
        to: hour[hour.length - 1].to,
        consumption:
          hour.reduce((sum, consumption) => sum + consumption.consumption, 0) /
          hour.length,
      }));
      const sortedHourlyConsumptions = hourlyConsumptions.sort(
        (a, b) => b.consumption - a.consumption
      );
      this.highestConsumptions = sortedHourlyConsumptions
        .slice(0, 3)
        .map((item) => ({
          from: item.from.toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          to: item.to.toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          consumption: item.consumption.toFixed(2),
        }));
      this.lowestConsumptions = sortedHourlyConsumptions
        .slice(-3)
        .map((item) => ({
          from: item.from.toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          to: item.to.toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          consumption: item.consumption.toFixed(2),
        }));
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
  clicked: boolean = false;
  chartClicked($event: { event?: import("chart.js").ChartEvent|undefined; active?: {}[]|undefined; }) {
      this.clicked = !this.clicked;
    }
}
