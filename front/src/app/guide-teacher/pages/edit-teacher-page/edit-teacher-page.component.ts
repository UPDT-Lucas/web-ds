import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CheckboxInputComponent } from '../../../shared/components/checkbox-input/checkbox-input.component';
import { S3ApiService } from '../../../s3-api.service';
import { CommunicationService } from '../../../services/communication.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-teacher-page',
  standalone: true,
  imports: [
    InputComponent,
    HeaderComponent,
    FileInputComponent,
    ButtonComponent,
    CheckboxInputComponent
  ],
  templateUrl: './edit-teacher-page.component.html',
  styleUrl: './edit-teacher-page.component.css'
})
export class EditTeacherPageComponent {

  id: string = "";
  firstName: string = '';
  secondName: string = '';
  firstSurname: string = '';
  secondSurname: string = '';
  email: string = '';
  campus: string = '663057863ee524ad51bd5b0f';
  cellPhone: string = '';
  officePhone: string = '';
  //isCordinator: string = '';

  constructor(private s3ApiService: S3ApiService, private CS: CommunicationService, private routers: Router) {
    this.id = localStorage.getItem('-id') || '';
  }

  filename: string = "assets/images/teacher.png"
  file!: any;

  selectedValue: string = "1";

  getFile(file: any) {
    this.file = file;
  }

  getData(){
    const formData = new FormData();
    formData.append('file', this.file);
    this.s3ApiService.uploadFile(formData).subscribe(
      res => {
        this.updateImage(this.file.name)
      }
    )
  }

  updateImage(filename: string){
    this.s3ApiService.getFileByName(filename).subscribe(
      res => {
        this.filename = res!.result
        console.log(this.filename)
      }
    )
  }

  OnSelectChange(event: any) {
    if(event !== null){
      this.selectedValue = event.target.value
      console.log(this.selectedValue)
    }
  }

  isCordinator: boolean = false;

  toggleIsCoordinator(event: any) {
    this.isCordinator = event.target.checked;
  }


  onCampusChange(event: any) {
    const selectedValue = event?.target?.value;
    if (selectedValue) {
      this.campus = selectedValue;
    }
  }  
  

  editTeacher() {
    this.getData();
    const professorData = {
      //id: this.id,
      firstName: this.firstName,
      secondName: this.secondName,
      firstSurname: this.firstSurname,
      secondSurname: this.secondSurname,
      email: this.email,
      campus: this.campus,
      cellPhone: this.cellPhone,
      officePhone: this.officePhone,
      isCordinator: this.isCordinator
    };

    console.log(professorData);

    this.CS.editAccount(this.id, professorData).subscribe(
      response => {
        console.log('La información del profesor se ha actualizado con éxito:', response);
        this.routers.navigate(["/viewProfile"])
        
      },
      error => {
        console.error('Error al actualizar la información del profesor:', error);
      }
    );
  }
}

