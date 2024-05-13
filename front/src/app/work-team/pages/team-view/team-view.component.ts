import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CommunicationService } from '../../../services/communication.service';
import { Professor } from '../../../interfaces/professor.interface';
import {Router} from "@angular/router";

@Component({
  selector: 'app-team-view',
  standalone: true,
  imports: [
    HeaderComponent,
    ButtonComponent,
    TableComponent
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
    ['Código', 'span'], 
    ['Acciones', 'icon']]

   actions = [['delete', ''],
    ['edit', '/editTeacher'],
    ['exit_to_app', '']]

  data: any [] = []

  constructor(private CS: CommunicationService, private router: Router) {}

  /*handleEdit(email: string) {
    console.log('Correo del profesor:', email);

  }*/

  viewMemberDetails(email: string) {
    this.router.navigate(['/member-details', email]);
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

    getData(professorList: any) {
      for(const index in professorList.professors){
        console.log(professorList.professors[index])
      
        const rolProfessor = professorList.professors[index].isCordinator ? "Profesor Coordinador" : "Profesor";
        const nameProfessor = professorList.professors[index].firstName + " " + professorList.professors[index].firstSurname;
        const emailProfessor = professorList.professors[index].email;
        const campusName = this.CS.getCampusById(professorList.professors[index].campus);
        const campusBadge = this.getBadge(campusName);
        const campusProfessor = campusBadge;
        const professorData = [
          rolProfessor, nameProfessor, emailProfessor, campusProfessor, this.actions
        ];
        this.data.push(professorData);
      }
    }


  ngOnInit(){
    this.CS.getAllProfessor().subscribe(
      res => {
        this.professorList = res
       // console.log(this.professorList);
       this.getData(res) 
      }
    )
  }
}
