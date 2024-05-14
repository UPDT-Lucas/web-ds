import { Component } from '@angular/core';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CommunicationService } from '../../../services/communication.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-student-page',
  standalone: true,
  imports: [
    ButtonComponent,
    HeaderComponent,
    InputComponent,
    FileInputComponent
  ],
  templateUrl: './edit-student-page.component.html',
  styleUrl: './edit-student-page.component.css'
})
export class EditStudentPageComponent {
  
  selectedValue: string = "1";
  id: string = "";
  email: string = "";
  cellPhone: string = "";
  carnet: string = "";
  firstName: string = "";
  campus: string = '663057863ee524ad51bd5b0f';
  secondName: string = "";
  firstSurname: string = "";
  secondSurname: string = "";

  constructor( private CS: CommunicationService, private routers: Router) {
    //this.id = localStorage.getItem('-id') || '';
    //console.log(this.id)
  }


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

  editStudent(id: string) {
   // this.getData();
    const studentData = {
      id: this.id,
      firstName: this.firstName,
      secondName: this.secondName,
      firstSurname: this.firstSurname,
      secondSurname: this.secondSurname,
      carnet: this.carnet,
      campus: this.campus,
      email: this.email,
      cellPhone: this.cellPhone
     
    };
    console.log("ID ACTUAL",this.id);

    console.log(studentData);

    this.CS.editAccountStudent(this.id, studentData).subscribe(
      response => {
        console.log('La información del estudiante se ha actualizado con éxito:', response);
        this.routers.navigate(["/"])
        
      },
      error => {
        console.error('Error al actualizar la información del estudiante:', error);
      }
    );
  }


}
