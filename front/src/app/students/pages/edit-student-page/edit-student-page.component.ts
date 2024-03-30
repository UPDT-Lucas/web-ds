import { Component } from '@angular/core';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-edit-student-page',
  standalone: true,
  imports: [
    ButtonComponent,
    HeaderComponent,
    InputComponent,
    FileInputComponent
  ],
  templateUrl: './edit-student-page.component.html',
  styleUrl: './edit-student-page.component.css'
})
export class EditStudentPageComponent {

}
