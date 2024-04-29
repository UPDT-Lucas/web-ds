import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';

@Component({
  selector: 'app-add-student-page',
  standalone: true,
  imports: [
    ButtonComponent,
    HeaderComponent,
    InputComponent,
    FileInputComponent,
  ],
  templateUrl: './add-student-page.component.html',
  styleUrl: './add-student-page.component.css'
})
export class AddStudentPageComponent {

}
