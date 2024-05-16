import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CommunicationService } from '../../../services/communication.service';
import { AssistantResponse } from '../../../interfaces/assistant.interface';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    HeaderComponent,
    ButtonComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent  implements OnInit {
  
  firstName: string = '';
  firstSurname: string = '';
  secondSurname: string = '';
  id: string = ''
  isTeacher: boolean = true

  constructor(private CS: CommunicationService) {}

  ngOnInit(): void {
    this.id = this.CS.getActualUser().id
    this.isTeacher = this.CS.getActualUser().isTeacher             
    // console.log(this.isTeacher)
    if(this.isTeacher){
      this.CS.getProfessor(this.id).subscribe(
        prof => {
          this.firstName = prof.account.name.firstName
          this.firstSurname = prof.account.name.firstSurname
          this.secondSurname = prof.account.name.secondSurname
        }
      )
    }else{
      this.CS.getAssistant(this.id).subscribe(
        res => {
          this.firstName = res.assistant.firstName
          this.firstSurname = res.assistant.firstSurname
          this.secondSurname = res.assistant.secondSurname
        }
      )
    }

  }

}
