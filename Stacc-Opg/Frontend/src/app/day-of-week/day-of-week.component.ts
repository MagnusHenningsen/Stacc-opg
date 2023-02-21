import { Component, ViewChild } from '@angular/core';
import { ConsumptionService } from '../Services/consumption.service';
import { Consumption } from '../Consumption';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-day-of-week',
  templateUrl: './day-of-week.component.html',
  styleUrls: ['./day-of-week.component.scss'],
})
export class DayOfWeekComponent {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    datasets: [
      {
        data: [],
        label: 'Average By Day of Week',
        fill: true,
        tension: 0.5,
        borderColor: 'rgb(200,50,50)',
        backgroundColor: 'rgba(200,50,50,0.3)',
      },
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
  };
  public lineChartLegend = true;

  public consumptions: Consumption[] = [];
  line: any;
  lowestConsumptions: { day: string; consumption: number, total: number}[] = [];
  highestConsumptions: { day: string; consumption: number, total: number }[] = [];

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
      this.ConvertToDayOfWeek();
      let dataFormatted = new Array();
      for (let i = 0; i < 7; i++) {
        let total = this.DOW.get(i);
        let avg = total / this.DOWC.get(i);
        console.log(this.getDayOfWeekString(i));
        dataFormatted.push({
          day: this.getDayOfWeekString(i),
          consumption: avg,
          total: total
        });
      }
      this.lineChartData.datasets[0].data = dataFormatted.map(
        (item) => item.consumption
      );
      if (this.chart && this.chart.chart) {
        this.chart.chart.update();
      }
      console.log(dataFormatted);
      dataFormatted.sort((a, b) => a.consumption - b.consumption);
      this.lowestConsumptions = dataFormatted.slice(0, 3);
      this.highestConsumptions = dataFormatted.slice(4, 7);
      console.log(dataFormatted);
      console.log(this.lowestConsumptions);
      console.log(this.highestConsumptions);
    });
  }
  /**
   * Sorts data by day of week
   */
  DOW = new Map();
  DOWC = new Map();
  ConvertToDayOfWeek() {
    for (let i = 0; i < 7; i++) {
      this.DOWC.set(i, 0);
    }
    this.consumptions.forEach((x) => {
      console.log(x.from.getDay() + ' - ' + x.from.toLocaleString('en-GB'));
      switch (x.from.getDay()) {
        case 0:
          this.setMapValue(6, x);
          break;
        case 1:
          this.setMapValue(0, x);
          break;
        case 2:
          this.setMapValue(1, x);
          break;
        case 3:
          this.setMapValue(2, x);
          break;
        case 4:
          this.setMapValue(3, x);
          break;
        case 5:
          this.setMapValue(4, x);
          break;
        case 6:
          this.setMapValue(5, x);
          break;
        default:
          console.log('error');
          break;
      }
    });
  }
  setMapValue(index: number, cons: Consumption) {
    let count = this.DOWC.get(index);
    count++;
    this.DOWC.set(index, count);
    let sum = 0;
    if (count > 1) {
      sum = this.DOW.get(index);
      sum += cons.consumption;
    } else {
      sum = cons.consumption;
    }
    this.DOW.set(index, sum);
  }
  getDayOfWeekString(day: number) {
    console.log(day);
    switch (day) {
      case 0:
        return 'Monday';
      case 1:
        return 'Tuesday';
      case 2:
        return 'Wednesday';
      case 3:
        return 'Thursday';
      case 4:
        return 'Friday';
      case 5:
        return 'Saturday';
      case 6:
        return 'Sunday';
      default:
        return '';
    }
  }
  clicked: boolean = false;
  chartClicked($event: {
    event?: import('chart.js').ChartEvent | undefined;
    active?: {}[] | undefined;
  }) {
    this.clicked = !this.clicked;
  }
}
