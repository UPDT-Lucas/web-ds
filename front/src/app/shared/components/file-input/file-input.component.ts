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

  preview: string = ""

  @Input()
  isPDF: boolean = false
  
  @Input()
  placeholderPreviewImage: string = ""

  @Input()
  acceptedExtensions: string [] = [];

  @Input()
  placeholder: string = "";

  @Input()
  files!: any
  
  @Output()
  fileSelected = new EventEmitter<any>()

  onFileChange(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      if(!this.isPDF){
        this.preview = URL.createObjectURL(file)
      }
      this.fileSelected.emit(file)
    }
  }
}

