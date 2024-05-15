import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CommunicationService } from '../../../services/communication.service';
import { Professor } from '../../../interfaces/professor.interface';
import { Router } from "@angular/router";
import { InputComponent } from '../../../shared/components/input/input.component';
import { EditTeacherPageComponent } from '../../../guide-teacher/pages/edit-teacher-page/edit-teacher-page.component';

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
export class TeamViewComponent{

  professorList: Professor[] = []

  headers = [
    ['Rol', 'text'],
    ['Nombre', 'text'],
    ['Correo', 'text'],
    ['Código', 'span'],
    ['Acciones', 'icon']]

  actions = [['delete', ''],
  ['edit', ''],
  ['exit_to_app', '']]

  data: any[] = []
  page: number = 0;
  actualSkip: number = 0;
  limit: number = 0;
  filterOnInput: string = ""
  filter: boolean = false;

  constructor(private CS: CommunicationService, private router: Router) { }

  /*handleEdit(email: string) {
    console.log('Correo del profesor:', email);

  }*/

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
      console.log(professorList.professors[index])

      console.log("Índice:", index);
      console.log("Información:", professorList.professors[index]);
    
      const id = professorList.professors[index]._id; 
      console.log("ID:", id);


      const professorActions = JSON.parse(JSON.stringify(this.actions));
      professorActions[1][1] = `/editTeacher/${id}`;
      //professorActions[0][1] = `deleteProfessor('${id}')`;
      //professorActions[0][1] = () => this.deleteProfessor(id);
      //professorActions[0][1] = `${id}`;




      const rolProfessor = professorList.professors[index].isCordinator ? "Profesor Coordinador" : "Profesor";
      const nameProfessor = professorList.professors[index].firstName + " " + professorList.professors[index].firstSurname;
      const emailProfessor = professorList.professors[index].email;
      const campusName = this.CS.getCampusById(professorList.professors[index].campus);
      const campusBadge = this.getBadge(campusName);
      const campusProfessor = campusBadge;
      const professorData = [
        rolProfessor, nameProfessor, emailProfessor, campusProfessor, professorActions
      ];
      this.data.push(professorData);
    }
  }
  

  changePage(limit: number, nextPage: number) {
    if (nextPage >= 0) {
      if (this.filter) {
        this.CS.getProfessorByName(this.filterOnInput, limit, nextPage * limit).subscribe(
          res => {
            if (res.professors.length != 0) {
              console.log(res)
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
    
    this. CS.deleteProfessor(id).subscribe(() => {
      console.log('Profesor eliminado exitosamente');
      
      this.router.navigate(['/']);
    }, error => {
      console.error('Error al eliminar el profesor', error);
    });
  }
    
    
  ngOnInit() {
    this.limit = 5
    this.changePage(5, 0)
    console.log("aaa")
  }
}



