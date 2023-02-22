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
  recommendedOption: Provider | null = null;

  ngOnInit() {
    this.collectData().then(() => {
      this.fixedPrice();
      this.variablePrice();
      this.spotPrice(true);
      this.spotPrice(false);
      setTimeout(() => {
        this.recommendedOption = this.recommendation();
      }, 0);
      
    });
  }
  bestFixedOption: Provider | null = null;
  bestFixedOptionTotal: number = 0;
  FixedPros: string[] = [];
  FixedCons: string[] = [];
  fixedPrice() {
    let potentialProviders = this.providerData.filter(
      (p) => p.pricingModel == 'fixed'
    );
    let avgMonthlyFee = 0;
    let bestOption: any = null;
    let lowestCost = Infinity;
    let bestOptionTotal = 0;
    let avgPricePeriod = 0;
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
      avgMonthlyFee += provider.monthlyFee;
      avgPricePeriod += provider.fixedPricePeriod!;
      if (
        monthAvg < lowestCost ||
        (monthAvg == lowestCost &&
          bestOption.fixedPricePeriod > provider.fixedPricePeriod!)
      ) {
        lowestCost = monthAvg;
        bestOption = provider;
        bestOptionTotal = total;
      }
    });
    this.bestFixedOptionTotal = lowestCost;
    this.bestFixedOption = bestOption;
    this.FixedPros.push(
      'Average price per month with current trend: ' +
        lowestCost.toLocaleString('en-GB', { maximumFractionDigits: 2 }) +
        ' NOK'
    );
    if (this.bestFixedOption!.fixedPricePeriod! > 1) {
      this.FixedPros.push(
        'Estimated total price for ' +
          this.bestFixedOption?.fixedPricePeriod +
          ' months ' +
          bestOptionTotal.toLocaleString('en-GB', {
            maximumFractionDigits: 2,
          }) +
          ' NOK'
      );
    } else {
      this.FixedPros.push(
        'Estimated total price for ' +
          this.bestFixedOption?.fixedPricePeriod +
          ' month ' +
          bestOptionTotal.toLocaleString('en-GB', {
            maximumFractionDigits: 2,
          }) +
          ' NOK'
      );
    }
    if (
      this.bestFixedOption!.fixedPricePeriod! >
      avgPricePeriod / potentialProviders.length
    ) {
      this.FixedCons.push(
        `Longer price period than average in category (${this.bestFixedOption!
          .fixedPricePeriod!} months vs ${
          avgPricePeriod / potentialProviders.length
        } months average`
      );
    } else if (
      this.bestFixedOption!.fixedPricePeriod! <
      avgPricePeriod / potentialProviders.length
    ) {
      this.FixedPros.push(
        `Shorter price period than average in category (${this.bestFixedOption!
          .fixedPricePeriod!} months vs ${
          avgPricePeriod / potentialProviders.length
        } months average`
      );
    }
    if (
      this.bestFixedOption!.monthlyFee >
      avgMonthlyFee / potentialProviders.length
    ) {
      this.FixedCons.push(
        `Higher average monthly fee (${
          this.bestFixedOption!.monthlyFee
        } NOK vs ${(avgMonthlyFee / potentialProviders.length).toLocaleString(
          'en-GB',
          { maximumFractionDigits: 2 }
        )} NOK average in pricing category.)`
      );
    } else if (
      this.bestFixedOption!.monthlyFee <
      avgMonthlyFee / potentialProviders.length
    ) {
      this.FixedPros.push(
        `Lower average monthly fee (${
          this.bestFixedOption!.monthlyFee
        } NOK vs ${(avgMonthlyFee / potentialProviders.length).toLocaleString(
          'en-GB',
          { maximumFractionDigits: 2 }
        )} NOK average in pricing category.)`
      );
    }
  }
  bestVarOption: Provider | null = null;
  bestVarOptionTotal: number = 0;
  VariableCons: string[] = [];
  VariablePros: string[] = [];

  variablePrice() {
    let potentialProviders = this.providerData.filter(
      (p) => p.pricingModel == 'variable'
    );
    let avgMonthlyFee = 0;
    let bestOption: any = null;
    let lowestCost = Infinity;
    let bestOptionTotal = 0;
    let avgPricePeriod = 0;
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
      avgPricePeriod += provider.variablePricePeriod!;
      avgMonthlyFee += provider.monthlyFee;
      if (
        monthAvg < lowestCost ||
        (monthAvg == lowestCost &&
          bestOption.variablePricePeriod > provider.variablePricePeriod!)
      ) {
        lowestCost = monthAvg;
        bestOption = provider;
        bestOptionTotal = total;
      }
    });
    this.bestVarOption = bestOption;
    this.bestVarOptionTotal = lowestCost;
    this.VariablePros.push(
      'Average price per month with current trend: ' +
        lowestCost.toLocaleString('en-GB', { maximumFractionDigits: 2 }) +
        ' NOK'
    );
    if (this.bestVarOption!.variablePricePeriod! > 1) {
      this.VariablePros.push(
        'Estimated total price for ' +
          this.bestVarOption!.variablePricePeriod +
          ' months ' +
          bestOptionTotal.toLocaleString('en-GB', {
            maximumFractionDigits: 2,
          }) +
          ' NOK'
      );
    } else {
      this.VariablePros.push(
        'Estimated total price for ' +
          this.bestVarOption!.variablePricePeriod +
          ' month ' +
          bestOptionTotal.toLocaleString('en-GB', {
            maximumFractionDigits: 2,
          }) +
          ' NOK'
      );
    }
    if (
      this.bestVarOption!.variablePricePeriod! >
      avgPricePeriod / potentialProviders.length
    ) {
      this.VariableCons.push(
        `Longer price period than average in category (${this.bestVarOption!
          .variablePricePeriod!} months vs ${
          avgPricePeriod / potentialProviders.length
        } months average`
      );
    } else if (
      this.bestVarOption!.variablePricePeriod! <
      avgPricePeriod / potentialProviders.length
    ) {
      this.VariablePros.push(
        `Shorter price period than average in category (${this.bestVarOption!
          .variablePricePeriod!} months vs ${
          avgPricePeriod / potentialProviders.length
        } months average`
      );
    }
    if (
      this.bestVarOption!.monthlyFee >
      avgMonthlyFee / potentialProviders.length
    ) {
      this.VariableCons.push(
        `Higher average monthly fee (${
          this.bestVarOption!.monthlyFee
        } NOK vs ${(avgMonthlyFee / potentialProviders.length).toLocaleString(
          'en-GB',
          { maximumFractionDigits: 2 }
        )} NOK average in pricing category.)`
      );
    } else if (
      this.bestVarOption!.monthlyFee <
      avgMonthlyFee / potentialProviders.length
    ) {
      this.VariablePros.push(
        `Lower average monthly fee (${this.bestVarOption!.monthlyFee} NOK vs ${(
          avgMonthlyFee / potentialProviders.length
        ).toLocaleString('en-GB', {
          maximumFractionDigits: 2,
        })} NOK average in pricing category.)`
      );
    }
  }
  bestSpotHourly: Provider | null = null;
  bestSpotHourlyTotal: number = 0;
  bestSpotMonthly: Provider | null = null;
  bestSpotMonthlyTotal: number = 0;
  SpotHourlyPros: string[] = [];
  SpotHourlyCons: string[] = [];
  SpotHourlyHighEst: number = 0;
  SpotHourlyLowEst: number = 0;
  SpotMonthlyPros: string[] = [];
  SpotMonthlyCons: string[] = [];
  SpotMonthlyHighEst: number = 0;
  SpotMonthlyLowEst: number = 0;
  
  spotPrice(variant: boolean) {
    let potentialProviders = variant
      ? this.providerData.filter((p) => p.pricingModel == 'spot-hourly')
      : this.providerData.filter((p) => p.pricingModel == 'spot-monthly');
    let avgMonthlyFee = 0;
    let bestOption: any = null;
    let lowestCost = Infinity;
    let TrendPercentageM = 0.10;
    let TrendPercentageH = 0.01;
    potentialProviders.forEach((provider) => {
      let price = 0;
      let days = 0;
      let date = Infinity;
      let mnth = Infinity;
      let months = 0;
      let spotHighEst = provider.spotPrice;
      let spotHighPrice = 0;
      let spotLowEst = provider.spotPrice;
      let spotLowPrice = 0;

      this.consumptionData.forEach((x) => {
        price += x.consumption * provider.spotPrice!;
        spotHighPrice += x.consumption * spotHighEst!;
        spotLowPrice += x.consumption * spotLowEst!;
        if (x.from.getDate() != date) {
          days++;
          date = x.from.getDate();
          if (variant) {
            spotHighEst! += spotHighEst! * TrendPercentageH;
            spotLowEst! -= spotLowEst! * TrendPercentageH;
          }
        }
        if (!variant && x.from.getMonth() != mnth) {
          mnth = x.from.getMonth();
          months++;
          spotHighEst! += spotHighEst! * TrendPercentageM;
          spotLowEst! -= spotLowEst! * TrendPercentageM;
        }
      });

      let dayAvg = price / days;
      let monthAvg = dayAvg * 30 + provider.monthlyFee;
      spotHighPrice = spotHighPrice! / days;
      spotLowPrice = spotLowPrice! / days;
      spotHighPrice = spotHighPrice * 30 + provider.monthlyFee;
      spotLowPrice = spotLowPrice * 30 + provider.monthlyFee;
      avgMonthlyFee += provider.monthlyFee;
      if (
        monthAvg < lowestCost ||
        (monthAvg == lowestCost &&
          bestOption.variablePricePeriod > provider.variablePricePeriod!)
      ) {
        lowestCost = monthAvg;
        bestOption = provider;
        variant ? this.bestSpotHourlyTotal = lowestCost : this.bestSpotMonthlyTotal = lowestCost;
        variant ? this.SpotHourlyHighEst = spotHighPrice : this.SpotMonthlyHighEst = spotHighPrice;
        variant ? this.SpotHourlyLowEst = spotLowPrice : this.SpotMonthlyLowEst = spotLowPrice;
      }
    });
    variant
      ? (this.bestSpotHourly = bestOption)
      : (this.bestSpotMonthly = bestOption);
    if (variant) {
      // hourly
      this.SpotHourlyPros.push(
        'Average price per month with current trend: ' +
          lowestCost.toLocaleString('en-GB', { maximumFractionDigits: 2 }) +
          ' NOK'
      );
      this.SpotHourlyPros.push('Average price given downwards trend of '+TrendPercentageH * 100+'% = ' + this.SpotHourlyLowEst.toLocaleString('en-GB', {maximumFractionDigits: 2})+ ' NOK');
      this.SpotHourlyCons.push('Average price given upwards trend of '+TrendPercentageH * 100+'% = ' + this.SpotHourlyHighEst.toLocaleString('en-GB', {maximumFractionDigits: 2})+ ' NOK');
      if (bestOption.monthlyFee > avgMonthlyFee / potentialProviders.length) {
        this.SpotHourlyCons.push(`Higher average monthly fee (${this.bestSpotHourly!.monthlyFee} NOK vs ${(avgMonthlyFee / potentialProviders.length).toLocaleString('en-GB',{ maximumFractionDigits: 2 })} NOK average in pricing category.)`);
      } else if (bestOption.monthlyFee < avgMonthlyFee / potentialProviders.length) {
        this.SpotHourlyPros.push(`Lower average monthly fee (${this.bestSpotHourly!.monthlyFee} NOK vs ${(avgMonthlyFee / potentialProviders.length).toLocaleString('en-GB',{ maximumFractionDigits: 2 })} NOK average in pricing category.)`);
      }
    } else {
      // monthly
      this.SpotMonthlyPros.push(
        'Average price per month with current trend: ' +
          lowestCost.toLocaleString('en-GB', { maximumFractionDigits: 2 }) +
          ' NOK'
      );
      this.SpotMonthlyPros.push('Average price given downwards trend of '+TrendPercentageM * 100+'% = ' + this.SpotMonthlyLowEst.toLocaleString('en-GB', {maximumFractionDigits: 2})+ ' NOK');
      this.SpotMonthlyCons.push('Average price given upwards trend of '+TrendPercentageM * 100+'% = ' + this.SpotMonthlyHighEst.toLocaleString('en-GB', {maximumFractionDigits: 2})+ ' NOK');
      if (bestOption.monthlyFee > avgMonthlyFee / potentialProviders.length) {
        this.SpotMonthlyCons.push(
          `Higher average monthly fee (${
            this.bestSpotMonthly!.monthlyFee
          } NOK vs ${(avgMonthlyFee / potentialProviders.length).toLocaleString(
            'en-GB',
            { maximumFractionDigits: 2 }
          )} NOK average in pricing category.)`
        );
      } else if (
        bestOption.monthlyFee <
        avgMonthlyFee / potentialProviders.length
      ) {
        this.SpotMonthlyPros.push(
          `Lower average monthly fee (${
            this.bestSpotMonthly!.monthlyFee
          } NOK vs ${(avgMonthlyFee / potentialProviders.length).toLocaleString(
            'en-GB',
            { maximumFractionDigits: 2 }
          )} NOK average in pricing category.)`
        );
      }
    }
  }
recommendation() {
    let options = [];

    if (this.bestFixedOption) {
        options.push({Provider: this.bestFixedOption, total: this.bestFixedOptionTotal, type: 'fixed'});
    }

    if (this.bestVarOption) {
        options.push({Provider: this.bestVarOption, total: this.bestVarOptionTotal, type: 'variable'});
    }

    if (this.bestSpotHourly) {
        options.push({Provider: this.bestSpotHourly, total: this.bestSpotHourlyTotal, type: 'spot-hourly'});
    }

    if (this.bestSpotMonthly) {
        options.push({Provider: this.bestSpotMonthly, total: this.bestSpotMonthlyTotal, type: 'spot-monthly'});
    }

    options.sort((a, b) => {
        if (a.total !== b.total) {
            return a.total - b.total;
        } else {
            const typeOrder = new Map();
            typeOrder.set('spot-hourly', 0);
            typeOrder.set('spot-monthly', 1);
            typeOrder.set('variable', 2);
            typeOrder.set('fixed', 3);
            return typeOrder.get(a.type) - typeOrder.get(b.type);
        }
    });

    const best = options[0];
    console.log(best.Provider);
    let el = document.getElementById(best.type) as HTMLElement;
    el.style.borderColor = "green";
    return best.Provider;
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
