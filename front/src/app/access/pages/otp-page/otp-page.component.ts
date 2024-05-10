import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router } from '@angular/router';

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

  code: string = ""
  confirmationCode: string = ""
  
  constructor(private router: Router) {}

  getInput(){
    console.log(this.code)
    console.log(this.confirmationCode)
    this.router.navigate(["changePassword/confirmation"])
  }
}
