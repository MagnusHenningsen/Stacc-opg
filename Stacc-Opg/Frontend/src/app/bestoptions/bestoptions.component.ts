import { Component } from '@angular/core';
import { Consumption } from '../Consumption';
import { Provider } from '../Provider';
import { ConsumptionService } from '../Services/consumption.service';
import { ProvidersService } from '../Services/providers.service';

@Component({
  selector: 'app-bestoptions',
  templateUrl: './bestoptions.component.html',
  styleUrls: ['./bestoptions.component.scss'],
})
export class BestoptionsComponent {
  constructor(
    private consumptionService: ConsumptionService,
    private providerService: ProvidersService
  ) {}
  consumptionData: Consumption[] = [];
  providerData: Provider[] = [];
  ngOnInit() {
    this.collectData().then(() => {
      this.fixedPrice();
      this.variablePrice();
    });
  }
  fixedPrice() {
    let potentialProviders = this.providerData.filter((p) => p.pricingModel == 'fixed');
  
    let bestOption: any = null;
    let lowestTotalCost = Infinity;
    let bestOptionTotal = 0;
    potentialProviders.forEach((provider) => {
      let price = 0;
      let days = 0;
      let date = 0;
      this.consumptionData.forEach((x) => {
        price += x.consumption * provider.fixedPrice!;
        if (x.from.getDate() != date) {
          days++;
          date = x.from.getDate();
        }
      });
      let dayAvg = price / days;
      let monthAvg = dayAvg * 30 + provider.monthlyFee;
      let total = monthAvg * provider.fixedPricePeriod!;
 
      if (monthAvg < lowestTotalCost || monthAvg == lowestTotalCost && bestOption.fixedPricePeriod > provider.fixedPricePeriod!) {
        lowestTotalCost = monthAvg;
        bestOption = provider;
        bestOptionTotal = total;
      }
    });
    console.log(potentialProviders);
    console.log(bestOption);
    console.log(
      lowestTotalCost.toLocaleString('en-GB', { maximumFractionDigits: 2 }) +
      ' NOK for registered consumption, following this trend total price for ' +
      bestOption.fixedPricePeriod! +
      ' months = ' +
      bestOptionTotal.toLocaleString('en-GB', { maximumFractionDigits: 2 }) +
      ' NOK'
    );
  }  
  
  variablePrice() {
    let potentialProviders = this.providerData.filter((p) => p.pricingModel == 'variable');
  
    let bestOption: any = null;
    let lowestTotalCost = Infinity;
    let bestOptionTotal = 0;
    potentialProviders.forEach((provider) => {
      let price = 0;
      let days = 0;
      let date = 0;
      this.consumptionData.forEach((x) => {
        price += x.consumption * provider.variablePrice!;
        if (x.from.getDate() != date) {
          days++;
          date = x.from.getDate();
        }
      });
      let dayAvg = price / days;
      let monthAvg = dayAvg * 30 + provider.monthlyFee;
      let total = monthAvg * provider.variablePricePeriod!;
  
      if (monthAvg < lowestTotalCost || monthAvg == lowestTotalCost && bestOption.variablePricePeriod > provider.variablePricePeriod!) {
        lowestTotalCost = monthAvg;
        bestOption = provider;
        bestOptionTotal = total;
      }
      
    });
    console.log(potentialProviders);
    console.log(bestOption);
    console.log(
      lowestTotalCost.toLocaleString('en-GB', { maximumFractionDigits: 2 }) +
      ' NOK for registered consumption, following this trend total price for ' +
      bestOption.variablePricePeriod! +
      ' months = ' +
      bestOptionTotal.toLocaleString('en-GB', { maximumFractionDigits: 2 }) +
      ' NOK'
    );

  }
  /**
   * Collects data from both provider api and consumer api
   */
  collectData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.providerService.getProviders().subscribe((data: any) => {
        this.providerData = data.map((provider: Provider) => {
          if (provider.pricingModel == 'fixed') {
            return new Provider(
              provider.name,
              provider.pricingModel,
              provider.monthlyFee,
              provider.fixedPrice,
              provider.fixedPricePeriod,
              undefined,
              undefined,
              undefined
            );
          } else if (provider.pricingModel == 'variable') {
            return new Provider(
              provider.name,
              provider.pricingModel,
              provider.monthlyFee,
              undefined,
              undefined,
              provider.variablePrice,
              provider.variablePricePeriod,
              undefined
            );
          } else {
            return new Provider(
              provider.name,
              provider.pricingModel,
              provider.monthlyFee,
              undefined,
              undefined,
              undefined,
              undefined,
              provider.spotPrice
            );
          }
        });
        this.consumptionService.getConsumption().subscribe((data: any) => {
          this.consumptionData = data.map(
            (item: any) =>
              new Consumption(
                item.from,
                item.to,
                item.consumption,
                item.consumptionUnit
              )
          );
          resolve();
        });
      });
    });
  }
}
