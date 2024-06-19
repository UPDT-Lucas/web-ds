import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CommunicationService } from '../../../services/communication.service';
import { Router } from '@angular/router';
import { Professor } from '../../../interfaces/professor.interface';
import { Student } from '../../../interfaces/student.interface';

@Component({
  selector: 'app-view-profile-page',
  standalone: true,
  imports: [
    HeaderComponent,
    ButtonComponent,
  ],
  templateUrl: './view-profile-page.component.html',
  styleUrl: './view-profile-page.component.css'
})
export class ViewProfilePageComponent {

  id: string = '';
  name: string = '';
  email: string = '';
  officePhone: string = '';
  phone: string = '';
  campus: string = '';
  photo: string = '/assets/images/profileHolder.png';
  actualUser!: any;
  consecutive: string = ''
  role: string = '';
  carnet: string = '';
  //isCordinator: string = '';



  constructor(
    private CS: CommunicationService,
    private router: Router) {
    //console.log(this.id);
  }

  ngOnInit() {
    this.id = this.CS.getActualUser().id
    this.role = this.CS.getActualUser().role 
    if(this.role == 'professor'){
      this.getProfessorInfo()
    }else{
      this.getStudentInfo()
    }

  }

  editProfile(){
    this.router.navigate(['/editUser', this.id])
  }

  getProfessorInfo(){
    this.CS.getProfessor(this.id).subscribe(
      res => {
        this.actualUser = res
        this.email = this.actualUser.account.email
        this.name = this.actualUser.account.name.firstName + " " + this.actualUser.account.name.secondName + " " + this.actualUser.account.name.firstSurname + " " + this.actualUser.account.name.secondSurname
        this.officePhone = this.actualUser.account.officePhone
        this.phone = this.actualUser.account.cellPhone
        this.photo = this.actualUser.account.photo
        this.consecutive = this.actualUser.account.code

        if (this.actualUser.account.campus === "663057633ee524ad51bd5b05") {
          this.campus = "Cartago";
        } else if (this.actualUser.account.campus === "6630576f3ee524ad51bd5b09") {
          this.campus = "Alajuela";
        } else if (this.actualUser.account.campus === "663057763ee524ad51bd5b0c") {
          this.campus = "San Carlos";
        } else if (this.actualUser.account.campus === "663057863ee524ad51bd5b0f") {
          this.campus = "San José";
        } else if (this.actualUser.account.campus === "6630578f3ee524ad51bd5b12") {
          this.campus = "Limón";
        }

      }
    )
  }

  getStudentInfo(){
    this.CS.getStudent(this.id).subscribe(
      res => {
        console.log(res)
        this.actualUser = res
        this.email = this.actualUser.account.email
        this.name = this.actualUser.account.name.firstName + " " + this.actualUser.account.name.secondName + " " + this.actualUser.account.name.firstSurname + " " + this.actualUser.account.name.secondSurname
        this.phone = this.actualUser.account.cellPhone
        this.carnet = this.actualUser.account.carnet
        this.photo = this.actualUser.account.photo

        if (this.actualUser.account.campus === "663057633ee524ad51bd5b05") {
          this.campus = "Cartago";
        } else if (this.actualUser.account.campus === "6630576f3ee524ad51bd5b09") {
          this.campus = "Alajuela";
        } else if (this.actualUser.account.campus === "663057763ee524ad51bd5b0c") {
          this.campus = "San Carlos";
        } else if (this.actualUser.account.campus === "663057863ee524ad51bd5b0f") {
          this.campus = "San José";
        } else if (this.actualUser.account.campus === "6630578f3ee524ad51bd5b12") {
          this.campus = "Limón";
        }
      }
    )
  }

}
