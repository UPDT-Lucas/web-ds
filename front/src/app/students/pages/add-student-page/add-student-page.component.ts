import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { CommunicationService } from '../../../services/communication.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-student-page',
  standalone: true,
  imports: [
    ButtonComponent,
    HeaderComponent,
    InputComponent,
    FileInputComponent,
  ],
  templateUrl: './add-student-page.component.html',
  styleUrl: './add-student-page.component.css'
})
export class AddStudentPageComponent {

  constructor(private CS: CommunicationService, private routers: Router){}

  firstName: string = "";
  secondName: string = "";
  firstSurname: string = "";
  secondSurname: string = "";
  carnet: string = "";
  campus: string = "663057863ee524ad51bd5b0f";
  email: string = "";
  cellPhone: string = "";
  selectedValue: string = "";

  OnSelectChange(event: any) {
    if(event !== null){
      this.selectedValue = event.target.value
      console.log(this.selectedValue)
    }
  }

  onCampusChange(event: any) {
    const selectedValue = event?.target?.value;
    if (selectedValue) {
      this.campus = selectedValue;
    }
  }   
 
  addStudent() {
    const studentData = {
      firstName: this.firstName,
      secondName: this.secondName,
      firstSurname: this.firstSurname,
      secondSurname: this.secondSurname,
      campus: this.campus,
      email: this.email,
      carnet: this.carnet,
      cellPhone: this.cellPhone,

      
    };

    console.log(studentData);

    this.CS.registerStudent(studentData).subscribe(
      response => {
        console.log('La información del estudiante se ha agregado con éxito:', response);
        this.routers.navigate(["/viewStudents"])
        
      },
      error => {
        console.error('Error al agregar la información del estudiante:', error);
      }
    );
  }
}
