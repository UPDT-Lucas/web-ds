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
import { Router } from "@angular/router";
import { InputComponent } from '../../../shared/components/input/input.component';
import { ExcelStudent } from "../../../interfaces/excelStudent.interface";
import { AssistantResponse } from "../../../interfaces/assistant.interface";
import { Professor } from "../../../interfaces/professor.interface";
import { CheckboxInputComponent } from "../../../shared/components/checkbox-input/checkbox-input.component";
import { DropdownMenuComponent } from "../../../shared/components/dropdown-menu/dropdown-menu.component";

@Component({
  selector: "app-view-students-page",
  standalone: true,
  imports: [
    ButtonComponent,
    HeaderComponent,
    TableComponent,
    FileInputComponent,
    InputComponent,
    CheckboxInputComponent,
    DropdownMenuComponent
  ],
  templateUrl: "./view-students-page.component.html",
  styleUrl: "./view-students-page.component.css",
})
export class ViewStudentsPageComponent {
  constructor(
    private fileSaver: FileSaverService,
    private CS: CommunicationService,
    private router: Router
  ) { }

  studentList: Student[] = [];
  selectedDropdownValues: boolean[] = []
  studentListToDownload: any[] = [];

  file: any;

  campusOptions = [
    'San José', 'Cartago',
    'Alajuela', 'San Carlos',
    'Limón']

  headers = [
    ['Rol', 'text'],
    ['Nombre', 'text'],
    ['Correo', 'text'],
    ['Carnet', 'text'],
    ['Código', 'span']]

  actions: any

  data: any[] = [];
  excelData: any[] = [];
  page: number = 0;
  actualSkip: number = 0;
  limit: number = 0;
  filterOnInput: string = ""
  filter: boolean = false;
  campusFilter: boolean = false;
  userIsTeacher: boolean = false;
  actualProfessor!: Professor;
  assistant!: AssistantResponse;
  actualId: string = ""


  ngOnInit() {
    const user = this.CS.getActualUser()
    this.actualId = user.id
    this.userIsTeacher = user.isTeacher
    if (user.isTeacher) {
      this.getProfessor()
      this.actions = [['edit']]
      this.headers.push(['Acciones', 'icon'])
    } else {
      this.getAssistant()
      this.actions = [['delete'], ['edit', '']]
      this.headers.push(['Acciones', 'icon'])
    }
    this.limit = 5
  }

  getAssistant() {
    this.CS.getAssistant(this.actualId).subscribe(
      assistant => {
        this.assistant = assistant
        this.changePage(5, 0)
      }
    )
  }

  getProfessor() {
    this.CS.getProfessor(this.actualId).subscribe(
      prof => {
        this.actualProfessor = prof
        this.changePage(5, 0)
      }
    )
  }


  setActions() {
    this.headers.push(['Acciones', 'icon'])
  }

  searchByName() {
    if (this.filterOnInput) {
      this.filter = true
    } else {
      this.filter = false
    }
    this.changePage(5, 0)
  }

  viewMemberDetails(email: string) {
    this.router.navigate(['/member-details', email]);
  }


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
    const selectionCampusName = this.getActualCampus();
    let selectionCampusId: string[] = [];
    this.campusFilter = false
    selectionCampusName.forEach(selection => {
      selectionCampusId.push(this.getCampusId(selection)!);
      if(selection) {
        this.campusFilter = true
      }
    });
    if(this.campusFilter){
      this.CS.getStudentsByCampus(selectionCampusId, 0, 0).subscribe(
        res => {
          if (res.students.length != 0) {
            this.data = []
            this.excelData = []
            this.studentList = res
            this.getData(res)
            this.getExcelData(this.studentList);

            const data = this.excelData;

            const jsonData = data.map((row) => {
              return columns.reduce((obj: { [key: string]: any }, column, index) => {
                obj[column] = row[index];
                return obj;
              }, {});
            });

            let formattedDataSJ = [];
            let formattedDataCA = [];
            let formattedDataAL = [];
            let formattedDataSC = [];
            let formattedDataLI = [];

            console.log(jsonData)

            for (let index in jsonData) {
              if (jsonData[index]['campus'] == "San José") {
                formattedDataSJ.push(jsonData[index]);
              } else if (jsonData[index]['campus'] == "Cartago") {
                formattedDataCA.push(jsonData[index]);
              } else if (jsonData[index]['campus'] == "Alajuela") {
                formattedDataAL.push(jsonData[index]);
              } else if (jsonData[index]['campus'] == "San Carlos") {
                formattedDataSC.push(jsonData[index]);
              } else if (jsonData[index]['campus'] == "Limón") {
                formattedDataLI.push(jsonData[index]);
              }
            }

            const worksheetSJ: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedDataSJ);
            const worksheetCA: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedDataCA);
            const worksheetAL: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedDataAL);
            const worksheetSC: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedDataSC);
            const worksheetLI: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedDataLI);

            const workbook: XLSX.WorkBook = {
              Sheets: {
                "San José": worksheetSJ,
                "Cartago": worksheetCA,
                "Alajuela": worksheetAL,
                "San Carlos": worksheetSC,
                "Limón": worksheetLI
              },
              SheetNames: ["San José", "Cartago", "Alajuela", "San Carlos", "Limón"],
            };
            const excelBuffer: any = XLSX.write(workbook, {
              bookType: "xlsx",
              type: "array",
            });
            const blobData = new Blob([excelBuffer], { type: EXCEL_TYPE });
            this.fileSaver.save(blobData, `students${EXCEL_EXTENSION}`); //FileName
          }
        }
      );
    } else {
      this.CS.getAllStudent(0, 0).subscribe(
        res => {
          if (res.students.length != 0) {
            this.data = []
            this.excelData = []
            this.studentList = res
            this.getData(res)
            this.getExcelData(this.studentList);

            const data = this.excelData;

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
        }
      )
    }
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
        let student: ExcelStudent = {
          firstName: (jsonData[index] as any).firstName.toString(),
          secondName: (jsonData[index] as any).secondName.toString(),
          firstSurname: (jsonData[index] as any).firstSurname.toString(),
          secondSurname: (jsonData[index] as any).secondSurname.toString(),
          email: (jsonData[index] as any).email.toString(),
          campus: this.getCampusId((jsonData[index] as any).campus.toString()) ?? "",
          cellPhone: (jsonData[index] as any).cellPhone.toString(),
          carnet: (jsonData[index] as any).carnet.toString(),
        };

        console.log(student)

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
      return ["SJ", "#d68d33"]
    } else if (campus == "Alajuela") {
      return ["AL", "#d45c5c"]
    } else if (campus == "Cartago") {
      return ["CA", "#3372d6"]
    } else if (campus == "San Carlos") {
      return ["SC", "#ab60c2"]
    } else {
      return ["LI", "#43cb59"]
    }
  }

  getData(studentList: any) {
    for (const index in studentList.students) {
      // console.log(studentList.students[index]);
      // console.log("Indice", index);
      // console.log("Información:", studentList.students[index]);

      const id = studentList.students[index]._id;
      // console.log("ID:", id);

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
      // console.log(campusName);
      const campusBadge = this.getBadge(campusName);
      const campusStudent = campusBadge;


      const studentData = [
        rolStudent,
        nameStudent,
        emailStudent,
        carnetStudent,
        campusStudent,
        //this.actions,
      ];

      if (this.userIsTeacher) {
        const studentsActions = JSON.parse(JSON.stringify(this.actions));
        // console.log(this.actualProfessor)
        if (this.actualProfessor.account.campus == studentList.students[index].campus) {
          studentsActions[0][1] = `/editStudent/${id}`;
        }
        studentData.push(studentsActions)
      } else if (this.assistant) {
        const studentsActions = JSON.parse(JSON.stringify(this.actions));
        if (this.assistant.assistant.campus == studentList.students[index].campus) {
          studentsActions[0][1] = id;
          studentsActions[1][1] = `/editStudent/${id}`;
        } else {
          studentsActions[1][1] = `/viewStudents`;
        }
        studentData.push(studentsActions)
      }

      this.data.push(studentData);
    }
  }


  changePage(limit: number, nextPage: number) {
    if (nextPage >= 0) {
      if (this.filter) {
        this.CS.getStudentByName(this.filterOnInput, limit, nextPage * limit).subscribe(
          res => {
            if (res.students.length != 0) {
              // console.log(res)
              this.data = []
              this.studentList = res
              this.getData(res)
              this.page = nextPage;
            }
          }
        )
      } if(this.campusFilter){
        const selectionCampusName = this.getActualCampus();
        let selectionCampusId: string[] = [];
        selectionCampusName.forEach(selection => {
          selectionCampusId.push(this.getCampusId(selection)!);
        });
        if(selectionCampusId.length > (nextPage * limit)  ){
          this.CS.getStudentsByCampus(selectionCampusId, limit, nextPage * limit).subscribe(
            res => {
              if (res.students.length != 0) {
                this.data = []
                this.studentList = res
                this.getData(res)
              this.page = nextPage;
              }
            }
          );
        }
      } else {
        this.CS.getAllStudent(this.limit, nextPage * limit).subscribe(
          res => {
            if (res.students.length != 0) {
              this.data = []
              this.studentList = res
              this.getData(res)
              this.page = nextPage;
            }
          }
        )
      }
    }
  }

  deleteStudent(id: string) {
    this.CS.getStudent(id).subscribe(
      student => {
        if (!this.userIsTeacher) {
          if (this.assistant.assistant.campus == student.account.campus) {
            this.CS.deleteSudent(id).subscribe(() => {
              console.log('Estudiante eliminado exitosamente');
            });
          } 
        }
      })
  }

  getSelectedCampus(values: boolean[]) {
    this.selectedDropdownValues = values;
    console.log(this.selectedDropdownValues);
  }

  filterByCampus() {
    this.campusFilter = true  
    this.changePage(5,0)
    if (this.selectedDropdownValues.every(value => value === false)) {
      this.campusFilter = false
      this.changePage(5,0)
    }
  }

  getActualCampus(): string[] {
    let actualSelection: string[] = [];
    this.selectedDropdownValues.forEach((selected, index) => {
      if (selected) {
        actualSelection.push(this.campusOptions[index]);
      }
    });
    return actualSelection;
  }


}