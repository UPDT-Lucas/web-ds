import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'shared-checkbox-input',
  standalone: true,
  imports: [],
  templateUrl: './checkbox-input.component.html',
  styleUrl: './checkbox-input.component.css'
})
export class CheckboxInputComponent {

  @Input() isChecked: boolean = false;
  @Output() isCheckedChange: 
  EventEmitter<boolean> = new EventEmitter<boolean>();

  toggleCheckbox() {
    this.isChecked = !this.isChecked;
    this.isCheckedChange.emit(this.isChecked);
  }
}
