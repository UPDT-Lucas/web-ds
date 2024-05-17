import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'shared-dropdown-menu',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.css'
})
export class DropdownMenuComponent {
  @Input() options: string[] = [];
  @Input() selectedOptions: boolean[] = [];
  @Output() selectedOptionsChange = new EventEmitter<boolean[]>();

  isOpened: boolean = false;

  ngOnInit(){
    this.selectedOptions = Array(this.options.length).fill(false)
  }

  toggleOpen() {
    this.isOpened = !this.isOpened;
  }

  toggleOption(index: number) {
    this.selectedOptions[index] = !this.selectedOptions[index];
    this.selectedOptionsChange.emit(this.selectedOptions);
  }
}
