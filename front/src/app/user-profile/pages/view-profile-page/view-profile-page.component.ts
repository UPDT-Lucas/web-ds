import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'app-view-profile-page',
  standalone: true,
  imports: [ 
    HeaderComponent, 
    ButtonComponent 
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


  
  constructor(private CS: CommunicationService){
    this.id = localStorage.getItem('-id') || '';
  }

  
  ngOnInit(){
  this.CS.getProfessor(this.id).subscribe(
    res => {
      this.email = res.account.email
     this.name = res.account.name.firstName +" " +res.account.name.secondName+ " " +res.account.name.firstSurname+ " "+res.account.name.secondSurname
     //this.name = JSON.stringify(res.account.name)
     this.officePhone = res.account.officePhone
      this.phone = res.account.cellPhone
      //this.email = res.account.email
    }
  )
  }

  


}
