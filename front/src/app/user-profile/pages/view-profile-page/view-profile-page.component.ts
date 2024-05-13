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
  photo: string = '';
  
  //isCordinator: string = '';



  constructor(
    private CS: CommunicationService,
    private router: Router) {
    this.id = localStorage.getItem('-id') || '';
  }


  ngOnInit() {
    this.CS.getProfessor(this.id).subscribe(
      res => {
        this.email = res.account.email
        this.name = res.account.name.firstName + " " + res.account.name.secondName + " " + res.account.name.firstSurname + " " + res.account.name.secondSurname
        this.officePhone = res.account.officePhone
        this.phone = res.account.cellPhone
        this.photo = res.account.photo
        console.log("photo is")
        console.log(res)
        console.log(res.account)
        //this.isCordinator = res.account.isCordinator
        //console.log(this.isCordinator)


        if (res.account.campus === "663057633ee524ad51bd5b05") {
          this.campus = "Cartago";
        } else if (res.account.campus === "6630576f3ee524ad51bd5b09") {
          this.campus = "Alajuela";
        } else if (res.account.campus === "663057763ee524ad51bd5b0c") {
          this.campus = "San Carlos";
        } else if (res.account.campus === "663057863ee524ad51bd5b0f") {
          this.campus = "San José";
        } else if (res.account.campus === "6630578f3ee524ad51bd5b12") {
          this.campus = "Limón";
        }

      }
    )
  }

  editProfile(){
    this.router.navigate(['/editTeacher', this.id])
  }




}
