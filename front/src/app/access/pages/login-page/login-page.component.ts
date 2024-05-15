import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router, RouterModule } from '@angular/router';
import { S3ApiService } from '../../../s3-api.service';
import { CommunicationService } from '../../../services/communication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    RouterModule, 
    CommonModule 
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {


  constructor(private router: Router, private fileService: S3ApiService, private CS: CommunicationService,) {}

  email: string = '';
  password: string = '';
  showErrorMessage: boolean = false;
  errorMessage: string = '';
  
  //maskedPassword: string = '';
  /*
  handlePasswordInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.maskedPassword = target.value.replace(/./g, '*'); // Reemplazar cada carácter con un asterisco
    this.password = target.value; // Almacenar el valor de la contraseña real
  }*/

  getInputs(){

    if (!this.email && !this.password) {
      this.errorMessage = 'Por favor ingrese tanto el correo como la contraseña.';
      this.showErrorMessage = true; 
      return; 
    } else if (!this.email) {
      this.errorMessage = 'Por favor ingrese el correo.';
      this.showErrorMessage = true; 
      return; 
    } else if (!this.password) {
      this.errorMessage = 'Por favor ingrese la contraseña.';
      this.showErrorMessage = true; 
      return; 
    }
    
    this.CS.login(this.email, this.password).subscribe(
      (res) => {
        if(res.message === 'Login successful'){

        localStorage.setItem('-id', res._id);
        localStorage.setItem('firstName', res.firstName);
        localStorage.setItem('firstSurname', res.firstSurname);
        localStorage.setItem('secondSurname', res.secondSurname);

        console.log('id: ', res._id);
        console.log('Nombre:', res.firstName);
        console.log('Primer Apellido:', res.firstSurname);
        console.log('Segundo Apellido:', res.secondSurname);

         window.location.href = '/';
        }else{
          console.log('Error: ', res.error);
        }
      },
      (error) => {
        console.error('Error: ', error);
      }
    )
  }

}



