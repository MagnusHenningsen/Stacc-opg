export class Consumption {
  from: Date;
  to: Date;
  consumption: number;
  consumptionUnit: string;

  constructor(from: string, to: string, consumption: number, consumptionUnit: string) {
    this.from = new Date(Date.parse(from));
    this.to = new Date(Date.parse(to));
    this.consumption = consumption;
    this.consumptionUnit = consumptionUnit;
  }
}