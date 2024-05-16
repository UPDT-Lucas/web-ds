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
  
  activities: any[] = [{ title: 'Meeting', start: new Date(2024,2,26,10,30), end: new Date(2024,2,28,10,30), id: '1' }];
  calendarActivities: any = [];
  actualUser: {id: string, isTeacher: boolean} = {id: "", isTeacher: false}

  constructor(private router: Router, private CS: CommunicationService){}

  ngOnInit() {
    // console.log(this.activities)
    this.actualUser = this.CS.getActualUser()
    this.CS.getAllActivities().subscribe(
      (res) => {
        this.getData(res);
        this.formatCalendarActivities(this.activities);
      }
    )
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
    events: this.calendarActivities,
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
    // console.log(x);
    // console.log(new Date(2024,2,27,12,0))
    return this.calendarActivities;
  }


  getEventDetails(eventId: string) {
    this.router.navigate(['/viewActivity/'+eventId]);
  }

  formatCalendarActivities(activities: any) {
    for(const index in activities){
      const title = activities[index].activityName;
      const start = new Date(activities[index].announcementDate);
      const end = new Date(activities[index].executionDate);
      const id = activities[index]._id;
      this.calendarActivities.push({title, start, end, id});
    }
  }

  getData(ActivityList: any) {
    for(const index in ActivityList.activities){
      const _id = ActivityList.activities[index]._id;
      const typeOfActivity = ActivityList.activities[index].typeOfActivity;
      const activityName = ActivityList.activities[index].activityName;
      const responsibles = ActivityList.activities[index].responsibles;
      const executionDate = ActivityList.activities[index].executionDate;
      const executionWeek = ActivityList.activities[index].executionWeek;
      const announcementDate = ActivityList.activities[index].announcementDate;
      const reminderDates = ActivityList.activities[index].reminderDates;
      const comments = ActivityList.activities[index].comments;
      const isRemote = ActivityList.activities[index].isRemote;
      const virtualActivityLink = ActivityList.activities[index].virtualActivityLink;
      const activityPoster = ActivityList.activities[index].activityPoster;
      const currentState = ActivityList.activities[index].currentState;
      this.activities.push({ _id, typeOfActivity, activityName, responsibles, executionDate, executionWeek, announcementDate, reminderDates, comments, isRemote, virtualActivityLink, activityPoster, currentState});
    }
  }
}
