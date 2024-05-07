import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mail-page',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent
  ],
  templateUrl: './mail-page.component.html',
  styleUrl: './mail-page.component.css'
})
export class MailPageComponent {

  constructor(router: RouterModule) {}
}
