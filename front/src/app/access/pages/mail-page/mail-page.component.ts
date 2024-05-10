import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { RouterModule } from '@angular/router';
import { CommunicationService } from '../../../services/communication.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-mail-page',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './mail-page.component.html',
  styleUrl: './mail-page.component.css', 
})
export class MailPageComponent {

  constructor(private router: RouterModule, private CS:CommunicationService,  private routers:Router) {}

  updateEmail(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.email = value;
  }
  showAlert: boolean = false;
  email: string = '';

  sendEmail() {
    console.log(this.email)
    if (this.email !== '') {
      this.CS.forgotPassword(this.email).subscribe(
        (res) => {
  
          if (res.message) {
            //alert(res.message);
            window.location.href = '/changePassword/addOtp'; 
          } else if (res.error) {
            //alert(res.error);
          }
        },
        (error) => {
          //alert(error.error.error);
        }
      );
    } else {
      //alert('No hay ningún correo escrito.');
    }
    console.log(this.sendEmail)
  }
  

  ngOnInit(): void {
  }
}
