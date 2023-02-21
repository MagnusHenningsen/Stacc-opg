import { Component } from '@angular/core';
import { Consumption } from '../Consumption';
import { Provider } from '../Provider';
import { ConsumptionService } from '../Services/consumption.service';
import { ProvidersService } from '../Services/providers.service';

@Component({
  selector: 'app-bestoptions',
  templateUrl: './bestoptions.component.html',
  styleUrls: ['./bestoptions.component.scss']
})
export class BestoptionsComponent {
  constructor(private consumptionSerice: ConsumptionService, private providerService: ProvidersService) {}
  consumptionData: Consumption[] = [];
  providerData: Provider[] = [];
  ngOnInit() {

  }
}
