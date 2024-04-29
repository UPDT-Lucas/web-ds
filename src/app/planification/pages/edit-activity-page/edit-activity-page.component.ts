import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CheckboxInputComponent } from '../../../shared/components/checkbox-input/checkbox-input.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';

@Component({
  selector: 'app-edit-activity-page',
  standalone: true,
  imports: [
    HeaderComponent,
    ButtonComponent,
    CheckboxInputComponent,
    InputComponent,
    FileInputComponent
  ],
  templateUrl: './edit-activity-page.component.html',
  styleUrl: './edit-activity-page.component.css'
})
export class EditActivityPageComponent {

}
