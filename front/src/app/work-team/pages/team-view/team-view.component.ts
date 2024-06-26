import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CommunicationService } from '../../../services/communication.service';
import { Professor } from '../../../interfaces/professor.interface';
import { Router } from "@angular/router";
import { InputComponent } from '../../../shared/components/input/input.component';
import { EditTeacherPageComponent } from '../../../guide-teacher/pages/edit-teacher-page/edit-teacher-page.component';
import { AssistantResponse } from '../../../interfaces/assistant.interface';

@Component({
  selector: 'app-team-view',
  standalone: true,
  imports: [
    HeaderComponent,
    ButtonComponent,
    TableComponent,
    InputComponent
  ],
  templateUrl: './team-view.component.html',
  styleUrl: './team-view.component.css'
})
export class TeamViewComponent {

  professorList: Professor[] = []

  headers = [
    ['Rol', 'text'],
    ['Nombre', 'text'],
    ['Correo', 'text'],
    ['Código', 'span']]

  actions: any

  data: any[] = []
  page: number = 0;
  actualSkip: number = 0;
  limit: number = 0;
  filterOnInput: string = ""
  filter: boolean = false;
  actualProfessor!: Professor;
  actualId: string = "";
  role: string = '';
  assistant!: AssistantResponse;

  constructor(private CS: CommunicationService, private router: Router) { }

  ngOnInit() {
    this.actualId = this.CS.getActualUser().id
    this.role = this.CS.getActualUser().role  
    // if(user.isTeacher){
    //   this.getProfessor()
    // }else{
    //   this.getAssistant()
    //   this.headers.push(['Acciones', 'icon'])
    // }
    this.limit = 5
    this.changePage(5, 0)
    this.setActions()
  }

  setActions() {
      this.actions = 
      [['delete'],
      ['edit', '']]
  }

  // getProfessorCampus() {
  //   this.CS.getProfessor(this.actualId).subscribe(
  //     prof => {
  //       this.CS.getProfessorByCampus().subscribe(
  //         profList => console.log(profList)
  //       )
  //     }
  //   )
  // }

  getAssistant(){
    this.CS.getAssistant(this.actualId).subscribe(
      assistant => {
        this.assistant = assistant
      }
    )
  }

  getProfessor(){
    this.CS.getProfessor(this.actualId).subscribe(
      prof => {
        this.actualProfessor = prof
      }
    )
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

  getData(professorList: any) {
    for (const index in professorList.professors) {
      const id = professorList.professors[index]._id;

      const rolProfessor = professorList.professors[index].isCordinator ? "Profesor Coordinador" : "Profesor";
      const nameProfessor = professorList.professors[index].firstName + " " + professorList.professors[index].firstSurname;
      const emailProfessor = professorList.professors[index].email;
      const campusName = this.CS.getCampusById(professorList.professors[index].campus);
      const campusBadge = this.getBadge(campusName);
      const campusProfessor = campusBadge;
      var professorData = [
        rolProfessor, nameProfessor, emailProfessor, campusProfessor
      ];
      if(this.assistant){          
        const assistantActions = JSON.parse(JSON.stringify(this.actions));
        if(this.assistant.assistant.campus == "663057633ee524ad51bd5b05"){
      

          assistantActions[0][1] = id;
          assistantActions[1][1] = `/editTeacher/${id}`;
          
        }else if(this.assistant.assistant.campus == professorList.professors[index].campus){
          assistantActions[1][1] = `/editTeacher/${id}`;
        }else{
          assistantActions[1][1] = `/teamView`;
        }
        professorData.push(assistantActions)
      } 
      
      this.data.push(professorData);
    }
  }
  

  changePage(limit: number, nextPage: number) {
    if (nextPage >= 0) {
      if (this.filter) {
        this.CS.getProfessorByName(this.filterOnInput, limit, nextPage * limit).subscribe(
          res => {
            if (res.professors.length != 0) {
              this.data = []
              this.professorList = res
              this.getData(res)
              this.page = nextPage;
            }
          }
        )
      } else {
        this.CS.getAllProfessor(limit, nextPage * limit).subscribe(
          res => {
            if (res.professors.length != 0) {
              this.data = []
              this.professorList = res
              this.getData(res)
              this.page = nextPage;
            }
          }
        )
      } 2
    }
  }

  deleteProfessor(id: string) {
    this.CS.getProfessor(id).subscribe(
      professor => {
        if(this.role !== "professor"){
          if(this.assistant.assistant.campus == professor.account.campus){
            this.CS.deleteSudent(id).subscribe(() => {
              console.log('Profesor eliminado exitosamente');
            });
          }
        }
      }
    )
  }
}



