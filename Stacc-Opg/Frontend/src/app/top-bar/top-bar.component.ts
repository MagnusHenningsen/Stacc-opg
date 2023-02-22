import { Component } from '@angular/core';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {

  refresh() {
    window.location.reload(); // Temporary since there is no home site currently, it's just assumed that in a real application there would be one.
  }
}
