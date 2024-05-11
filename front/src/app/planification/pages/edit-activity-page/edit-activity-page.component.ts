import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CheckboxInputComponent } from '../../../shared/components/checkbox-input/checkbox-input.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { S3ApiService } from '../../../s3-api.service';

@Component({
  selector: 'app-edit-activity-page',
  standalone: true,
  imports: [
    HeaderComponent,
    ButtonComponent,
    CheckboxInputComponent,
    InputComponent,
    FileInputComponent
  ],
  templateUrl: './edit-activity-page.component.html',
  styleUrl: './edit-activity-page.component.css'
})
export class EditActivityPageComponent {
  constructor(private s3ApiService: S3ApiService) {}
  filename: string = "assets/images/saludMental.jpg"

  isPresential: boolean = true;
  file!: any;

  getFile(file: any) {
    this.file = file;
  }

  getData(){
    const formData = new FormData();
    formData.append('file', this.file);

    this.s3ApiService.uploadFile(formData).subscribe(
     (res) => {
        this.updateImage(this.file.name)
      }
    )
  }

  
  updateImage(filename: string){
    this.s3ApiService.getFileByName(filename).subscribe(
      res => {
        this.filename = res!.result
      }
    )
  }
}
