import { Component } from "@angular/core";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { TableComponent } from "../../../shared/components/table/table.component";
import { FileInputComponent } from "../../../shared/components/file-input/file-input.component";
import * as XLSX from "xlsx";
import { FileSaverService } from "ngx-filesaver";
import { co, el } from "@fullcalendar/core/internal-common";
import { CommunicationService } from "../../../services/communication.service";
import { Student } from "../../../interfaces/student.interface";

@Component({
  selector: "app-view-students-page",
  standalone: true,
  imports: [
    ButtonComponent,
    HeaderComponent,
    TableComponent,
    FileInputComponent,
  ],
  templateUrl: "./view-students-page.component.html",
  styleUrl: "./view-students-page.component.css",
})
export class ViewStudentsPageComponent {
  constructor(
    private fileSaver: FileSaverService,
    private CS: CommunicationService
  ) {}

  studentList: Student[] = [];

  file: any;

  headers = [
    ["Rol", "text"],
    ["Nombre", "text"],
    ["Correo", "text"],
    ["Carné", "text"],
    ["Código", "span"],
    ["Acciones", "icon"],
  ];

  actions = [
    ["delete", ""],
    ["edit", "/editTeacher"],
    ["exit_to_app", ""],
  ];

  data: any[] = [];
  excelData: any[] = [];

  downloadExcel(): void {
    const EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const EXCEL_EXTENSION = ".xlsx";
    const columns = [
      "firstName",
      "secondName",
      "firstSurname",
      "secondSurname",
      "email",
      "campus",
      "cellPhone",
      "carnet",
    ];
    const data = this.excelData;
    console.log(this.excelData);
    const jsonData = data.map((row) => {
      return columns.reduce((obj: { [key: string]: any }, column, index) => {
        obj[column] = row[index];
        return obj;
      }, {});
    });
    const formattedData = [];
    for (let index in jsonData) {
      formattedData.push(jsonData[index]);
    }
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = {
      Sheets: {
        Students: worksheet,
      },
      SheetNames: ["Students"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blobData = new Blob([excelBuffer], { type: EXCEL_TYPE });
    this.fileSaver.save(blobData, `students${EXCEL_EXTENSION}`); //FileName
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
      return ["LI", "#43cb59"]
    }
  }

  getData(studentList: any) {
    for (const index in studentList.students) {
      console.log(studentList.students[index]);

      const rolStudent = "Estudiante";
      const nameStudent =
        studentList.students[index].firstName +
        " " +
        studentList.students[index].firstSurname;
      const emailStudent = studentList.students[index].email;
      const carnetStudent = studentList.students[index].carnet;
      const campusName = this.CS.getCampusById(
        studentList.students[index].campus
      );
      console.log(campusName);
      const campusBadge = this.getBadge(campusName);
      const campusStudent = campusBadge;
      const studentData = [
        rolStudent,
        nameStudent,
        emailStudent,
        carnetStudent,
        campusStudent,
        this.actions,
      ];
      this.data.push(studentData);
    }
  }

  ngOnInit() {
    this.CS.getAllStudent().subscribe((res) => {
      //this.professorList = res
      // console.log(this.professorList);
      this.getData(res);
      this.getExcelData(res);
    });
  }
}
