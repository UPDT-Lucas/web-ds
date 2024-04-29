import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { RouterModule } from '@angular/router';
import { S3ApiService } from '../../../s3-api.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    RouterModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  constructor(router: RouterModule, private fileService: S3ApiService) {}

  getFiles(){
    this.fileService.getFiles().subscribe(
      files => {
        console.log(files)
      }
    )
  }

  getFileByName(){
    this.fileService.getFileByName("openheimer.jpg").subscribe(
      file => {
        console.log(file)
      }
    )
  }

  uploadFile(){
    this.fileService.uploadFile("D:\\Minuta001").subscribe(
      file => {
        console.log(file)
      }
    )
  }
}
