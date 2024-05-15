import { Component, Input } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es'
import { Router } from '@angular/router';
import { Activity } from '../../../interfaces/activity.interface';
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  
  @Input() activities: any[] = [{ title: 'Meeting', start: new Date(2024,2,26,10,30), end: new Date(2024,2,28,10,30), id: '1' }];
  calendarActivities: any = [];
  actualUser: {id: string, isTeacher: boolean} = {id: "", isTeacher: false}

  constructor(private router: Router, private CS: CommunicationService){}

  ngOnInit() {
    console.log(this.activities)
    this.actualUser = this.CS.getActualUser()
    if(this.actualUser.isTeacher){
      this.CS.getProfessor(this.actualUser.id).subscribe(
        prof => {
          if(prof.account.isCordinator){
            this.calendarOptions = this.calendarWthAddOptions
          }
        }
      )
    }
  }

  calendarOptions: CalendarOptions = {
    customButtons: {
      addActivity: {
        text: 'Agregar Actividad',
        click: () => {
          this.router.navigate(['/addActivity'])
        }
      }
    },
    eventClick: (event) => {
      this.getEventDetails(event.event.id)
      // console.log(event.event.id)
    },
    locale: esLocale,
    plugins: [dayGridPlugin],
    initialView: 'dayGridWeek',
    hiddenDays: [0],
    events: this.activities,
    headerToolbar: {
      start: 'title',
      center: '',
      end: ''
    },
    footerToolbar: {
      start: 'dayGridWeek,dayGridMonth',
      end: 'prev,next'
    }
  };

  calendarWthAddOptions: CalendarOptions = {
    customButtons: {
      addActivity: {
        text: 'Agregar Actividad',
        click: () => {
          this.router.navigate(['/addActivity'])
        }
      }
    },
    eventClick: (event) => {
      this.getEventDetails(event.event.id)
      // console.log(event.event.id)
    },
    locale: esLocale,
    plugins: [dayGridPlugin],
    initialView: 'dayGridWeek',
    hiddenDays: [0],
    events: this.activities,
    headerToolbar: {
      start: 'title',
      center: '',
      end: 'addActivity'
    },
    footerToolbar: {
      start: 'dayGridWeek,dayGridMonth',
      end: 'prev,next'
    }
  };

  getCalendarActivities() {
    let x = [{ title: 'Meeting', start: new Date(2024,2,26,10,30), end: new Date(2024,2,28,10,30), id: '1' },
    { title: 'Meeting', start: new Date(2024,2,27,12,0), end: new Date(2024,2,27,14,0), id: '2' }]
    console.log(x);
    console.log(new Date(2024,2,27,12,0))
    return this.calendarActivities;
  }


  getEventDetails(eventId: string) {
    this.router.navigate(['/viewActivity/'+eventId]);
  }
}
