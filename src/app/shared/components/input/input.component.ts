import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  @Input()
  placeholder: string = "";
}
