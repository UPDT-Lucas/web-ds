import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router, RouterModule } from '@angular/router';
import { S3ApiService } from '../../../s3-api.service';
import { AuthService } from '../../../services/AuthService';


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

  mail: string = ""
  password: string = ""

  constructor(private router: Router, private fileService: S3ApiService, private mongo: AuthService,) {}

  // getFiles(){
  //   this.fileService.getFiles().subscribe(
  //     files => {
  //       console.log(files)
  //     }
  //   )
  // }

  // getFileByName(){
  //   this.fileService.getFileByName("openheimer.jpg").subscribe(
  //     file => {
  //       console.log(file)
  //     }
  //   )
  // }

  // uploadFile(){
  //   this.fileService.uploadFile("D:\\Minuta001").subscribe(
  //     file => {
  //       console.log(file)
  //     })
  // }

  getInputs(){
    console.log(this.mail)
    console.log(this.password)
    this.router.navigate([""])
  }
    

  addProfessor(){
    this.mongo.registerProfessor()
    
  }
}



