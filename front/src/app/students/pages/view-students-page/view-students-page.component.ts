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

  uploadExcel(event: any): void {
    const file: File = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.readAsBinaryString(file);
    fileReader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      for (let index in jsonData) {
        let student: Student = {
          firstName: (jsonData[index] as any).firstName,
          secondName: (jsonData[index] as any).secondName,
          firstSurname: (jsonData[index] as any).firstSurname,
          secondSurname: (jsonData[index] as any).secondSurname,
          email: (jsonData[index] as any).email,
          campus: this.getCampusId((jsonData[index] as any).campus) ?? "",
          cellPhone: (jsonData[index] as any).cellPhone,
          carnet: (jsonData[index] as any).carnet,
        };

        this.CS.registerStudent(student).subscribe(
          (response) => {
            console.log(
              "La información del estudiante se ha agregado con éxito:",
              response
            );
          },
          (error) => {
            console.error(
              "Error al agregar la información del estudiante:",
              error
            );
          }
        );

        if (!file) {
          console.log("No file selected");
        }
      }
    };
  }

  getCampusId(campusName: string) {
    const campusData = [
      {
        _id: { $oid: "663057633ee524ad51bd5b05" },
        campusName: "Cartago",
      },
      {
        _id: { $oid: "6630576f3ee524ad51bd5b09" },
        campusName: "Alajuela",
      },
      {
        _id: { $oid: "663057763ee524ad51bd5b0c" },
        campusName: "San Carlos",
      },
      {
        _id: { $oid: "663057863ee524ad51bd5b0f" },
        campusName: "San José",
      },
      {
        _id: { $oid: "6630578f3ee524ad51bd5b12" },
        campusName: "Limón",
      },
    ];
    const campus = campusData.find(
      (campus) => campus.campusName === campusName
    );
    return campus ? campus._id.$oid : null;
  }

  getBadge(campus: string) {
    if (campus == "San José") {
      return ["SJ", "#d68d33"];
    } else if (campus == "Alajuela") {
      return ["AL", "#d45c5c"];
    } else if (campus == "Cartago") {
      return ["CA", "#3372d6"];
    } else if (campus == "San Carlos") {
      return ["SC", "#ab60c2"];
    } else {
      return ["LI", "43cb59"];
    }
  }

  getExcelData(studentList: any) {
    for (const index in studentList.students) {
      const firstName = studentList.students[index].firstName;
      const secondName = studentList.students[index].secondName;
      const firstSurname = studentList.students[index].firstSurname;
      const secondSurname = studentList.students[index].secondSurname;
      const email = studentList.students[index].email;
      const campus = this.CS.getCampusById(studentList.students[index].campus);
      const cellPhone = studentList.students[index].cellPhone;
      const carnet = studentList.students[index].carnet;
      const studentData = [
        firstName,
        secondName,
        firstSurname,
        secondSurname,
        email,
        campus,
        cellPhone,
        carnet,
      ];
      this.excelData.push(studentData);
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
