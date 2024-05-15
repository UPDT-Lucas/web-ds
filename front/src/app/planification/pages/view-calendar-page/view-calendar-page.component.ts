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

  activities: Activity[] = [];
  calendarActivities: any = [];
  actualUser: {id: string, isTeacher: boolean} = {id: "", isTeacher: true}

  // { title: 'Meeting', start: new Date(2024,2,26,10,30), end: new Date(2024,2,28,10,30), id: '1' },
  // { title: 'Meeting', start: new Date(2024,2,27,12,0), end: new Date(2024,2,27,14,0), id: '2' }

  ngOnInit() {
    this.actualUser = this.CS.getActualUser()
    this.CS.getAllActivities().subscribe(
      (res) => {
        this.getData(res);
        this.formatCalendarActivities(this.activities);
      }
    )
    console.log(this.activities)
  }

  formatCalendarActivities(activities: any) {
    for(const index in activities){
      const title = activities[index].activityName;
      const start = new Date(activities[index].announcementDate);
      const end = new Date(activities[index].executionDate);
      const id = index;
      this.calendarActivities.push({title, start, end, id});
    }
  }

  getData(ActivityList: any) {
    for(const index in ActivityList.activities){
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
      this.activities.push({typeOfActivity, activityName, responsibles, executionDate, executionWeek, announcementDate, reminderDates, comments, isRemote, virtualActivityLink, activityPoster, currentState});
    }
  }
}
