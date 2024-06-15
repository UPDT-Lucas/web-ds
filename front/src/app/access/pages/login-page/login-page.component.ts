import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router, RouterModule } from '@angular/router';
import { S3ApiService } from '../../../s3-api.service';
import { CommunicationService } from '../../../services/communication.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [  
    InputComponent,
    ButtonComponent,
    RouterModule, 
    CommonModule,
    FormsModule
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
    } else if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Por favor ingrese un correo electrónico válido.';
      this.showErrorMessage = true; 
      return; 
    }
    
    try{
      this.CS.login(this.email, this.password).subscribe(
        (res) => {
          if(res.message === 'Login successful') {
            this.CS.setActualUser(res._id, res.isTeacher);
            this.router.navigate(['/landing']);
          } else {
            this.errorMessage = res.error;
            this.showErrorMessage = true;
          }
        },
        (error) => {
          this.errorMessage = 'Error de conexión al servidor.';
          this.showErrorMessage = true;
          console.error('Error: ', error);
        }
      )
    }catch (error){
      console.log(error)
    }
    
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

}