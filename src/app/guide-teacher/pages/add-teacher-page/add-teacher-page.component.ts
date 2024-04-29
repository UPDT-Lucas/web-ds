import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { CheckboxInputComponent } from '../../../shared/components/checkbox-input/checkbox-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-add-teacher-page',
  standalone: true,
  imports: [
    HeaderComponent,
    InputComponent,
    FileInputComponent,
    CheckboxInputComponent,
    ButtonComponent
  ],
  templateUrl: './add-teacher-page.component.html',
  styleUrl: './add-teacher-page.component.css'
})
export class AddTeacherPageComponent {

}
