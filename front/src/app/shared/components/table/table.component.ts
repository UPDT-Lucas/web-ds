import { Component, Input } from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    BadgeComponent,
    RouterModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input()
  headers: string [][] = [];

  @Input()
  data: any [][] = [];

  constructor(router: RouterModule) {}
}
