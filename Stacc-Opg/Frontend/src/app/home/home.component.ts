import { Component } from '@angular/core';
import { ConsumptionService } from '../Services/consumption.service';
import { Consumption } from '../Consumption';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private consumptionService: ConsumptionService) {}
  /**
   * changes the status of the button clicked to active.
   * In the case of the clicked button already being active,
   * it will go to inactive.
   */
  activeBtn: HTMLElement | null = null;
  onButtonClick(event: Event): void {
    const clickedBtn = event.target as HTMLElement;
    this.placeContent(clickedBtn.id);
    if (this.activeBtn) {
      this.activeBtn.classList.remove('active');
    }
    if (this.activeBtn != clickedBtn) {
      clickedBtn.classList.add('active');
      this.activeBtn = clickedBtn;
    } else {
      this.activeBtn = null;
    }
  }
  /**
   * Collects user consumption data
   */
  consumptions: Consumption[] = [];

  loading: boolean = false;
  placeContent(id: string) {
    if (id == 'btn1' && this.activeBtn != null) {
      this.loading = true;
      this.consumptionService.getConsumption().subscribe((data: any) => {
        this.consumptions = data.map((item: any) => new Consumption(item.from, item.to, item.consumption, item.consumptionUnit));
        console.log(this.consumptions);
      });
      
     
      this.loading = true;
    }
  }
}
