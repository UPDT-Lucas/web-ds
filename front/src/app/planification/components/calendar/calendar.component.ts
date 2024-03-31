import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es'
import { Router } from '@angular/router';

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

  constructor(private router: Router){}

  calendarOptions: CalendarOptions = {
    customButtons: {
      addActivity: {
        text: 'Crear Actividad',
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
    events: [
      { title: 'Meeting', start: new Date(2024,2,26,10,30), end: new Date(2024,2,28,10,30), id: '1' },
      { title: 'Meeting', start: new Date(2024,2,27,12,0), end: new Date(2024,2,27,14,0), id: '2' }
    ],
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

  getEventDetails(eventId: string) {
    this.router.navigate(['/viewActivity']);
  }
}
