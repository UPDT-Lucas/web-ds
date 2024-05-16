import { Component } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CommunicationService } from '../../../services/communication.service';
import { Activity } from '../../../interfaces/activity.interface';

@Component({
  selector: 'app-view-calendar-page',
  standalone: true,
  imports: [
    CalendarComponent,
    HeaderComponent
  ],
  templateUrl: './view-calendar-page.component.html',
  styleUrl: './view-calendar-page.component.css'
})
export class ViewCalendarPageComponent {
  constructor(private CS: CommunicationService) {}

  actualUser: {id: string, isTeacher: boolean} = {id: "", isTeacher: true}

  // { title: 'Meeting', start: new Date(2024,2,26,10,30), end: new Date(2024,2,28,10,30), id: '1' },
  // { title: 'Meeting', start: new Date(2024,2,27,12,0), end: new Date(2024,2,27,14,0), id: '2' }

  ngOnInit() {
    this.actualUser = this.CS.getActualUser()

  }

}
