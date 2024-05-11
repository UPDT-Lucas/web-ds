import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { File } from '../../../interfaces/file.interface';
import { S3ApiService } from '../../../s3-api.service';

@Component({
  selector: 'shared-file-input',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.css'
})
export class FileInputComponent {
  constructor(private s3Service: S3ApiService) {}

  @Input()
  acceptedExtensions: string [] = [];

  @Input()
  placeholder: string = "";

  @Input()
  files!: any
  
  @Output()
  fileSelected = new EventEmitter<File>()

  onFileChange(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileSelected.emit(file);
    }
  }
}
