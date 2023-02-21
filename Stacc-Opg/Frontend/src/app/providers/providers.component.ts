import { Component } from '@angular/core';
import { Provider } from '../Provider';
import { ProvidersService } from '../Services/providers.service';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent {

  constructor(private providerService: ProvidersService) {}

  providers: Provider[] = [];
  ngOnInit() {
    this.providerService.getProviders().subscribe((data: any) => {
      this.providers = data.map((provider: Provider) => {
        if (provider.pricingModel == 'fixed') {
          return new Provider(provider.name, provider.pricingModel,
            provider.monthlyFee, provider.fixedPrice, provider.fixedPricePeriod,
            undefined, undefined, undefined);
        } else if (provider.pricingModel == 'variable') {
          return new Provider(provider.name, provider.pricingModel,
            provider.monthlyFee,undefined,undefined,
            provider.variablePrice, provider.variablePricePeriod, undefined);
        } else {
          return new Provider(provider.name, provider.pricingModel,
            provider.monthlyFee,undefined,undefined,
            undefined, undefined, provider.spotPrice);
        }
      });
    });
  }
}
