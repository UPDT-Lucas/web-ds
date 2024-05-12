import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import * as XLSX from 'xlsx';
import { FileSaverService } from 'ngx-filesaver';
import { el } from '@fullcalendar/core/internal-common';
import { CommunicationService } from '../../../services/communication.service';
import { Student } from '../../../interfaces/student.interface';

@Component({
  selector: 'app-view-students-page',
  standalone: true,
  imports: [
    ButtonComponent,
    HeaderComponent,
    TableComponent,
    FileInputComponent
  ],
  templateUrl: './view-students-page.component.html',
  styleUrl: './view-students-page.component.css'
})
export class ViewStudentsPageComponent {

  constructor(private fileSaver: FileSaverService, private CS: CommunicationService) { }

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

  downloadExcel(): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data = [
      { name: 'John Doe', age: 25 },
      { name: 'Jane Doe', age: 24 },
      { name: 'Jim Doe', age: 23 }
    ];
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { 
      Sheets: { 
        'Students': worksheet 
      }, 
      SheetNames: ['Students'] 
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blobData = new Blob([excelBuffer], { type: EXCEL_TYPE });
    this.fileSaver.save(blobData, `students${EXCEL_EXTENSION}`);  //FileName

  }

  uploadExcel(event: any): void {
    const file: File = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.readAsBinaryString(file);
    fileReader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      console.log(jsonData);
    };

    if (!file) {
      console.log('No file selected');
    }
  }

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
      return ["LI", "43cb59"]
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
