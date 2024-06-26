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
  role: string = ''

  constructor(private CS: CommunicationService) {}

  ngOnInit(): void {
    this.id = this.CS.getActualUser().id
    this.role = this.CS.getActualUser().role    
    if(this.role === 'professor'){
      this.CS.getProfessor(this.id).subscribe(
        prof => {
          this.firstName = prof.account.name.firstName
          this.firstSurname = prof.account.name.firstSurname
          this.secondSurname = prof.account.name.secondSurname
        }
      )
    }else if(this.role === 'assistant'){
      this.CS.getAssistant(this.id).subscribe(
        res => {
          this.firstName = res.assistant.firstName
          this.firstSurname = res.assistant.firstSurname
          this.secondSurname = res.assistant.secondSurname
        }
      )
    }else{
      this.CS.getStudent(this.id).subscribe(
        student => {
          this.firstName = student.account.name.firstName
          this.firstSurname = student.account.name.firstSurname
          this.secondSurname = student.account.name.secondSurname
        })
    }
  }

}
