import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CheckboxInputComponent } from '../../../shared/components/checkbox-input/checkbox-input.component';

@Component({
  selector: 'app-edit-teacher-page',
  standalone: true,
  imports: [
    InputComponent,
    HeaderComponent,
    FileInputComponent,
    ButtonComponent,
    CheckboxInputComponent
  ],
  templateUrl: './edit-teacher-page.component.html',
  styleUrl: './edit-teacher-page.component.css'
})
export class EditTeacherPageComponent {

}
