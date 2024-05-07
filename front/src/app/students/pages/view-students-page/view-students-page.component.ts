import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { TableComponent } from '../../../shared/components/table/table.component';

@Component({
  selector: 'app-view-students-page',
  standalone: true,
  imports: [
    ButtonComponent,
    HeaderComponent,
    TableComponent
  ],
  templateUrl: './view-students-page.component.html',
  styleUrl: './view-students-page.component.css'
})
export class ViewStudentsPageComponent {

}
