import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {

  @Input()
  text: string = "";

  @Input()
  bordered: boolean = false;
}
