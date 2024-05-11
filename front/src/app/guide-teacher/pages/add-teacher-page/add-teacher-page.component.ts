import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { CheckboxInputComponent } from '../../../shared/components/checkbox-input/checkbox-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { S3ApiService } from '../../../s3-api.service';
import { CommunicationService } from '../../../services/communication.service';
import {Router} from "@angular/router";

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
  constructor(private s3ApiService: S3ApiService, private CS: CommunicationService, private routers: Router) {}
  filename: string = "assets/images/profileHolder.png"
  
  file!: any;
  selectedValue: string = "1";

  //id: string = "";
  firstName: string = '';
  secondName: string = '';
  firstSurname: string = '';
  secondSurname: string = '';
  email: string = '';
  campus: string | null = null;
  cellPhone: string = '';
  officePhone: string = '';
  //isCordinator: string = '';

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


  addProfessor() {
    const password = "tec-" + this.firstSurname + this.firstName
    const professorData = {
      //id: this.id,
      firstName: this.firstName,
      secondName: this.secondName,
      firstSurname: this.firstSurname,
      secondSurname: this.secondSurname,
      email: this.email,
      password,
      campus: this.campus,
      cellPhone: this.cellPhone,
      officePhone: this.officePhone,
      isCordinator: this.isCordinator
      
    };

    console.log(professorData);

    this.CS.registerProfessor(professorData).subscribe(
      response => {
        console.log('La información del profesor se ha agregado con éxito:', response);
        this.routers.navigate(["/teamView"])
        
      },
      error => {
        console.error('Error al agregar la información del profesor:', error);
      }
    );
  }


}
