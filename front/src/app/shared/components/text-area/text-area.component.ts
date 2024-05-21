import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'shared-text-area',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.css'
})
export class TextAreaComponent {
  
  @Input()
  placeholder: string = '';

  @Input()
  entry: string = '';

  @Output()
  entryChange = new EventEmitter<string>();

  value: string = '';

  onInputChange(value: string) {
    this.entryChange.emit(value);
  }
}
