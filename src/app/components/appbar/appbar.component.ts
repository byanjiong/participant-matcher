import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
  selector: 'app-appbar',
  standalone: true,
  imports: [MatToolbarModule],
  templateUrl: './appbar.component.html',
  styleUrl: './appbar.component.scss'
})
export class AppbarComponent {

}
