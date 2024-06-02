import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CommunicationService } from '../../../services/communication.service';
import { Router } from '@angular/router';
import { Professor } from '../../../interfaces/professor.interface';

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
  actualProfessor!: Professor;
  consecutive: string = ''
  //isCordinator: string = '';



  constructor(
    private CS: CommunicationService,
    private router: Router) {
    //console.log(this.id);
  }

  ngOnInit() {
    this.id = localStorage.getItem('-id') || '';
    this.CS.getProfessor(this.id).subscribe(
      res => {
        this.actualProfessor = res
        this.email = this.actualProfessor.account.email
        this.name = this.actualProfessor.account.name.firstName + " " + this.actualProfessor.account.name.secondName + " " + this.actualProfessor.account.name.firstSurname + " " + this.actualProfessor.account.name.secondSurname
        this.officePhone = this.actualProfessor.account.officePhone
        this.phone = this.actualProfessor.account.cellPhone
        this.photo = this.actualProfessor.account.photo
        this.consecutive = this.actualProfessor.account.code

        if (this.actualProfessor.account.campus === "663057633ee524ad51bd5b05") {
          this.campus = "Cartago";
        } else if (this.actualProfessor.account.campus === "6630576f3ee524ad51bd5b09") {
          this.campus = "Alajuela";
        } else if (this.actualProfessor.account.campus === "663057763ee524ad51bd5b0c") {
          this.campus = "San Carlos";
        } else if (this.actualProfessor.account.campus === "663057863ee524ad51bd5b0f") {
          this.campus = "San José";
        } else if (this.actualProfessor.account.campus === "6630578f3ee524ad51bd5b12") {
          this.campus = "Limón";
        }

      }
    )
  }

  editProfile(){
    this.router.navigate(['/editTeacher', this.id])
  }


}
