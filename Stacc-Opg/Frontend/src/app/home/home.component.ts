import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  activeBtn: HTMLElement | null = null;

  onButtonClick(event: Event): void {
    const clickedBtn = event.target as HTMLElement;

    if (this.activeBtn) {
      this.activeBtn.classList.remove('active');
    }
    if (this.activeBtn != clickedBtn) {
    clickedBtn.classList.add('active');
    this.activeBtn = clickedBtn;
    }
  }
}
