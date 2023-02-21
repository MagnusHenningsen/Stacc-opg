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
        label: 'Day Average',
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
      if (this.chart && this.chart.chart) {
        this.chart.chart.update();
      }
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
}
