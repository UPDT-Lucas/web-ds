import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TableComponent } from '../../../shared/components/table/table.component';

@Component({
  selector: 'app-team-view',
  standalone: true,
  imports: [
    HeaderComponent,
    ButtonComponent,
    TableComponent
  ],
  templateUrl: './team-view.component.html',
  styleUrl: './team-view.component.css'
})
export class TeamViewComponent {

}
