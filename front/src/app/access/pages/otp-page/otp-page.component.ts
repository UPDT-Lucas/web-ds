import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-otp-page',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './otp-page.component.html',
  styleUrl: './otp-page.component.css'
})
export class OptPageComponent {
  
  constructor(router: RouterModule) {}

}
