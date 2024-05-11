import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CommunicationService } from '../../../services/communication.service';
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

  otp: string = "";
  confirmationCode: string = "";
  id: string = "";
  
  constructor(private router: Router, private CS: CommunicationService) {
    this.id = localStorage.getItem('-id') || '';
  }

  getInput() {

    if (this.id) {
      console.log(this.id)
      this.CS.verifyOtp(this.id, this.otp, this.confirmationCode).subscribe(
        (res) => {
          console.log(res);

          if (res && 'message' in res) {
           this.router.navigate(["changePassword/confirmation"]);
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
