import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-view-activity-page',
  standalone: true,
  imports: [
    HeaderComponent,
    ButtonComponent
  ],
  templateUrl: './view-activity-page.component.html',
  styleUrl: './view-activity-page.component.css'
})
export class ViewActivityPageComponent {

}
