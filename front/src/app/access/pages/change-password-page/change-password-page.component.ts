import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CommunicationService } from '../../../services/communication.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './change-password-page.component.html',
  styleUrl: './change-password-page.component.css'
})
export class ChangePasswordPageComponent {

  newPassword: string = "";
  confirmPassword: string = "";
  id: string = "";

  constructor(private router: Router, private CS: CommunicationService) {
    this.id = localStorage.getItem('-id') || '';
  }

  showErrorMessage: boolean = false;
  errorMessage: string = '';


  getInput() {
  
    if (this.id) {
      console.log(this.id)

      
    if (!this.newPassword && !this.confirmPassword) {
      this.errorMessage = 'Por favor ingrese tanto el contraseña nueva como la contraseña de confirmación.';
      this.showErrorMessage = true; 
      return;
    }else if (!this.newPassword) {
      this.errorMessage = 'Por favor ingrese la contraseña nueva';
      this.showErrorMessage = true; 
      return; 
    } else if (!this.confirmPassword) {
      this.errorMessage = 'Por favor ingrese la contraseña de confirmación.';
      this.showErrorMessage = true; 
      return; 
    } else if (!this.isValidPassword(this.newPassword, this.confirmPassword)) {
      this.errorMessage = 'Por favor ingrese una contraseña con mínimo 8 dígitos.';
      this.showErrorMessage = true; 
      return; 
    }

      this.CS.resetPassword(this.id, this.newPassword, this.confirmPassword).subscribe(
        (res) => {
          console.log(res);

          if (res && 'message' in res) {
           this.router.navigate(["/login"]);
          } else if (res && 'error' in res) {
          } else {
            console.warn("Respuesta inesperada del servidor:", res);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("ID de usuario no disponible");
    }
  }

  isValidPassword(newPassword: string, confirmationPassword: string): boolean {
    return newPassword.length >= 8 && newPassword === confirmationPassword;
  }
}  

