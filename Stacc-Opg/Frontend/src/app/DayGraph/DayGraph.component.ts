import { Component, ViewChild } from '@angular/core';
import { ConsumptionService } from '../Services/consumption.service';
import { Consumption } from '../Consumption';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-DayGraph',
  templateUrl: './DayGraph.component.html',
  styleUrls: ['./DayGraph.component.scss'],
})
export class DayGraphComponent {

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  title = 'Consumption chart';
  toDays: Consumption[][] = [];
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Average Hourly Consumption By Date',
        fill: true,
        tension: 0.5,
        borderColor: 'rgb(50,200,50)',
        backgroundColor: 'rgba(50,200,50,0.3)',
      },
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
    maintainAspectRatio: true,
  };
  public lineChartLegend = true;

  public consumptions: Consumption[] = [];
  line: any;
  lowestConsumptions: { date: Date; consumption: number; }[] = [];
  highestConsumptions: { date: Date; consumption: number; }[] = [];

  constructor(private consumptionService: ConsumptionService) {}

  ngOnInit() {
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
      this.consumptionService.DateArr = this.toDays;
      this.lineChartData.labels = this.toDays.map((day) =>
        day[0].from.toLocaleDateString()
      );
      this.lineChartData.datasets[0].data = this.toDays.map(
        (day) =>
          day.reduce((sum, consumption) => sum + consumption.consumption, 0) /
          24
      );
      if (this.chart && this.chart.chart) {
        this.chart.chart.update();
      }
      this.highestConsumptions = this.toDays
        .map((day) => ({
          date: day[0].from,
          consumption: day.reduce(
            (sum, consumption) => sum + consumption.consumption,
            0
          ),
        }))
        .sort((a, b) => b.consumption - a.consumption)
        .slice(0, 3);

      this.lowestConsumptions = this.toDays
        .map((day) => ({
          date: day[0].from,
          consumption: day.reduce(
            (sum, consumption) => sum + consumption.consumption,
            0
          ),
        }))
        .sort((a, b) => a.consumption - b.consumption)
        .slice(0, 3);
    });
  }

  /**
   * Convert initial input to be the consumption of a day
   */
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
  clicked: boolean = false;
  chartClicked($event: { event?: import("chart.js").ChartEvent|undefined; active?: {}[]|undefined; }) {
      this.clicked = !this.clicked;
    }
}
