import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'shared-header',
  standalone: true,
  imports: [
    ButtonComponent,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Input()
  isTeacher: boolean = true

  constructor(router: RouterModule){}
}
