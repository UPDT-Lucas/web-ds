import { Component, Input } from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    BadgeComponent
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input()
  headers: string [][] = [];

  @Input()
  data: any [][] = [];
}
