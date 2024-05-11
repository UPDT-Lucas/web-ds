import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'shared-input',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  @Input()
  placeholder: string = ""  

  @Input()
  entry!: string

  @Output()
  entryChange = new EventEmitter<string>()

  onInputChange(value: string) {
    this.entryChange.emit(value)
  }

  @Input() inputType: string = '';
}
