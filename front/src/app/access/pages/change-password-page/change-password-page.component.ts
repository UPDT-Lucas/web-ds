import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CommunicationService } from '../../../services/communication.service';
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

  newPassword: string = "";
  confirmPassword: string = "";
  id: string = "";

  constructor(private router: Router, private CS: CommunicationService) {
    this.id = localStorage.getItem('-id') || '';
  }


  getInput() {

    if (this.id) {
      console.log(this.id)
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
}
