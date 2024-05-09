import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mail-page',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    FormsModule
  ],
  templateUrl: './mail-page.component.html',
  styleUrl: './mail-page.component.css'
})
export class MailPageComponent {

  mail: string = ""

  constructor(private router: Router) {}

  getInput(){
    console.log(this.mail)
    this.router.navigate(["changePassword/addOtp"])
  }


}
