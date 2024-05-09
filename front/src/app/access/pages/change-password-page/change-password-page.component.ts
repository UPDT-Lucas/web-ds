import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './change-password-page.component.html',
  styleUrl: './change-password-page.component.css'
})
export class ChangePasswordPageComponent {

  password: string = ""
  confirmPassword: string = ""

  constructor(private router: Router) {}


  getInput(){
    console.log(this.password)
    console.log(this.confirmPassword)
    this.router.navigate(["login"])
  }
}
