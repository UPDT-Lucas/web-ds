import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    HeaderComponent,
    ButtonComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent  implements OnInit {
  
  firstName: string = '';
  firstSurname: string = '';
  secondSurname: string = '';
  constructor() { }

  ngOnInit(): void {
    // Recupera el nombre del usuario del almacenamiento local
    const userName = localStorage.getItem('firstName');
    if (userName !== null) {
      this.firstName = userName;
    }
    const userFirstSurname = localStorage.getItem('firstSurname');
    if (userFirstSurname !== null) {
      this.firstSurname = userFirstSurname;
    }
    const userSecondSurname = localStorage.getItem('secondSurname');
    if (userSecondSurname !== null) {
      this.secondSurname = userSecondSurname;
    }
  }

}
