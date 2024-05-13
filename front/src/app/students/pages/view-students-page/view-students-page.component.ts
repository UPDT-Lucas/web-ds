import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CommunicationService } from '../../../services/communication.service';
import { Student } from '../../../interfaces/student.interface';

@Component({
  selector: 'app-view-students-page',
  standalone: true,
  imports: [
    ButtonComponent,
    HeaderComponent,
    TableComponent
  ],
  templateUrl: './view-students-page.component.html',
  styleUrl: './view-students-page.component.css'
})
export class ViewStudentsPageComponent {

  studentList: Student[] = []

  headers = [
    ['Rol', 'text'],
    ['Nombre', 'text'], 
    ['Correo', 'text'], 
    ['Carné', 'text'],
    ['Código', 'span'], 
    ['Acciones', 'icon']]

  actions = [['delete', ''],
    ['edit', '/editTeacher'],
    ['exit_to_app', '']]

  data: any [] = []

  constructor(private CS: CommunicationService){}

  getBadge(campus: string){
    if(campus == "San José"){
      return ["SJ", "#d68d33"]
    }else if(campus == "Alajuela"){
      return ["AL", "#d45c5c"]
    }else if(campus == "Cartago"){
      return ["CA", "#3372d6"]
    }else if(campus == "San Carlos"){
      return ["SC", "#ab60c2"]
    }else{
      return ["LI", "#43cb59"]
    }
  }

  getData(studentList: any) {
    for(const index in studentList.students){
      console.log(studentList.students[index])
    
      const rolStudent = "Estudiante";
      const nameStudent = studentList.students[index].firstName + " " + studentList.students[index].firstSurname;
      const emailStudent = studentList.students[index].email;
      const carnetStudent = studentList.students[index].carnet;
      const campusName = this.CS.getCampusById(studentList.students[index].campus);
      const campusBadge = this.getBadge(campusName);
      const campusStudent = campusBadge;
      const studentData = [
        rolStudent, nameStudent, emailStudent, carnetStudent, campusStudent, this.actions
      ];
      this.data.push(studentData);
    }
  }

  ngOnInit(){
    this.CS.getAllStudent().subscribe(
      res => {
        //this.professorList = res
       // console.log(this.professorList);
       this.getData(res) 
      }
    )
  }

}
