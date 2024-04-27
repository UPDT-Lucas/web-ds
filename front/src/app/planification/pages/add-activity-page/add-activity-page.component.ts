import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CheckboxInputComponent } from '../../../shared/components/checkbox-input/checkbox-input.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';

@Component({
  selector: 'app-add-activity-page',
  standalone: true,
  imports: [
    ButtonComponent,
    HeaderComponent,
    CheckboxInputComponent,
    InputComponent,
    FileInputComponent
  ],
  templateUrl: './add-activity-page.component.html',
  styleUrl: './add-activity-page.component.css'
})
export class AddActivityPageComponent {

}
