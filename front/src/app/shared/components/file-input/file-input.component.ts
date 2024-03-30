import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-file-input',
  standalone: true,
  imports: [],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.css'
})
export class FileInputComponent {
  @Input()
  acceptedExtensions: string [] = [];

  @Input()
  placeholder: string = "";
}
