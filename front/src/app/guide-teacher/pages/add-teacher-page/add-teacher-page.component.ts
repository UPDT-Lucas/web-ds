import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { CheckboxInputComponent } from '../../../shared/components/checkbox-input/checkbox-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { S3ApiService } from '../../../s3-api.service';
import { CommunicationService } from '../../../services/communication.service';
import { Router } from "@angular/router";
import { Professor } from '../../../interfaces/professor.interface';
import { map } from 'rxjs';

@Component({
  selector: 'app-add-teacher-page',
  standalone: true,
  imports: [
    HeaderComponent,
    InputComponent,
    FileInputComponent,
    CheckboxInputComponent,
    ButtonComponent
  ],
  templateUrl: './add-teacher-page.component.html',
  styleUrl: './add-teacher-page.component.css'
})
export class AddTeacherPageComponent {
  constructor(private s3ApiService: S3ApiService, private CS: CommunicationService, private router: Router) { }
  // filename: string = "assets/images/profileHolder.png"
  filename: string = ""
  file!: any;
  selectedValue: string = "1";

  firstNameOnInput: string = '';
  secondNameOnInput: string = '';
  firstSurnameOnInput: string = '';
  secondSurnameOnInput: string = '';
  emailOnInput: string = '';
  campusOnInput: string = '663057863ee524ad51bd5b0f';
  cellPhoneOnInput: string = '';
  officePhoneOnInput: string = '';

  isCordinator: boolean = false;
  id: string = ""
  userIsTeacher: boolean = false

  ngOnInit(){
    this.id = this.CS.getActualUser().id
    this.userIsTeacher = this.CS.getActualUser().isTeacher
  }

  getFile(file: any) {
    this.file = file;
  }

  // getData(){
  //   if(this.file){
  //     const formData = new FormData();
  //     formData.append('file', this.file);
  //     this.s3ApiService.uploadFile(formData).subscribe(
  //      (res) => {
  //         this.updateImage(this.file.name)
  //       }
  //     )
  //   }
  // }


  // updateImage(filename: string){
  //   this.s3ApiService.getFileByName(filename).subscribe(
  //     res => {
  //       this.filename = res!.result
  //     }
  //   )
  // }

  OnSelectChange(event: any) {
    if (event !== null) {
      this.selectedValue = event.target.value
      console.log(this.selectedValue)
    }
  }


  toggleIsCoordinator(event: any) {
    this.isCordinator = event.target.checked;
  }


  onCampusChange(event: any) {
    const selectedValue = event?.target?.value;
    if (selectedValue) {
      this.campusOnInput = selectedValue;
    }
  }


  addProfessor() {
    const password = "tec-" + this.firstNameOnInput + this.secondNameOnInput;
    this.getData(password);
  }

  getData(password: string) {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      this.s3ApiService.uploadFile(formData).subscribe(
        (res) => {
          this.updateImage(this.file.name).subscribe(() => {
            this.addProfessorAfterUpdate(password);
          });
        }
      );
    }
  }

  updateImage(filename: string) {
    return this.s3ApiService.getFileByName(filename).pipe(
      map(res => {
        this.filename = res!.result;
      })
    );
  }

  addProfessorAfterUpdate(password: string) {
    const professorData = {
      firstName: this.firstNameOnInput,
      secondName: this.secondNameOnInput,
      firstSurname: this.firstSurnameOnInput,
      secondSurname: this.secondSurnameOnInput,
      email: this.emailOnInput,
      cellPhone: this.cellPhoneOnInput,
      officePhone: this.officePhoneOnInput,
      campus: this.campusOnInput,
      isCordinator: this.isCordinator,
      photo: this.filename,
      password,
    };

    console.log(professorData)

    this.CS.registerProfessor(professorData).subscribe(
      response => {
        console.log('La información del profesor se ha agregado con éxito:', response);
        this.router.navigate(["/teamView"])

      },
      error => {
        console.error('Error al agregar la información del profesor:', error);
      }
    );

  }

}



