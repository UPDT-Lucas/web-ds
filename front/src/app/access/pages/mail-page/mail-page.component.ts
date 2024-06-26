import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { RouterModule } from '@angular/router';
import { CommunicationService } from '../../../services/communication.service';
import {Router} from "@angular/router";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mail-page',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './mail-page.component.html',
  styleUrl: './mail-page.component.css', 
})
export class MailPageComponent {

  constructor(private router: Router, private CS:CommunicationService,  private routers:Router) {}

  updateEmail(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.email = value;
  }
  showAlert: boolean = false;
  email: string = '';
  showErrorMessage: boolean = false;
  errorMessage: string = '';

  sendEmail() {

    if (!this.email) {
      this.errorMessage = 'Por favor ingrese el correo.';
      this.showErrorMessage = true; 
    }  else if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Por favor ingrese un correo electrónico válido.';
      this.showErrorMessage = true; 
      return; 
    }

    console.log(this.email)
    if (this.email !== '') {
      console.log("holaa");
      this.CS.forgotPassword(this.email).subscribe(
        (res) => {
          console.log("holaaa");
          localStorage.setItem('-id', res._id);
          console.log('id: ', res._id);
          console.log(res);
          if(!res.error){
            this.routers.navigate(["changePassword/addOtp"])
          }
        }
      );
    } else {
      //alert('No hay ningún correo escrito.');
    }
    console.log(this.sendEmail)
  }
  


  getInput(){
    console.log(this.email)
    this.routers.navigate(["changePassword/addOtp"])
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

}
