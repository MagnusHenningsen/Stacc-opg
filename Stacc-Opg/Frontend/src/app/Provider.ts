export class Provider {
    name: string;
    pricingModel: "fixed" | "variable" | "spot-hourly" | "spot-monthly";
    monthlyFee: number;
    fixedPrice?: number;
    fixedPricePeriod?: number;
    variablePrice?: number;
    variablePricePeriod?: number;
    spotPrice?: number;
  
    constructor(
      name: string,
      pricingModel: "fixed" | "variable" | "spot-hourly" | "spot-monthly",
      monthlyFee: number,
      fixedPrice?: number,
      fixedPricePeriod?: number,
      variablePrice?: number,
      variablePricePeriod?: number,
      spotPrice?: number
    ) {
      this.name = name;
      this.pricingModel = pricingModel;
      this.monthlyFee = monthlyFee;
      this.fixedPrice = fixedPrice;
      this.fixedPricePeriod = fixedPricePeriod;
      this.variablePrice = variablePrice;
      this.variablePricePeriod = variablePricePeriod;
      this.spotPrice = spotPrice;
    }

  }
  