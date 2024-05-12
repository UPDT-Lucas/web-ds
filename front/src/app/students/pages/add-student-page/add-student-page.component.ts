import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';

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

  
/*
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

*/
}
