import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Input()
  isDelete: boolean = false

  @Output()
  delete: EventEmitter<string> = new EventEmitter<string>()

  constructor(router: RouterModule) {}

  deleteProfessor(id: string){
    this.delete.emit(id);
  }

}



