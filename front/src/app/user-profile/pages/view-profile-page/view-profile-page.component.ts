import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-view-profile-page',
  standalone: true,
  imports: [ 
    HeaderComponent, 
    ButtonComponent 
  ],
  templateUrl: './view-profile-page.component.html',
  styleUrl: './view-profile-page.component.css'
})
export class ViewProfilePageComponent {

}
