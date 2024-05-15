import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CommunicationService } from '../../../services/communication.service';
import { Activity } from '../../../interfaces/activity.interface';
import { ActivatedRoute } from '@angular/router';
import { Professor } from '../../../interfaces/professor.interface';

@Component({
  selector: 'app-view-activity-page',
  standalone: true,
  imports: [
    HeaderComponent,
    ButtonComponent
  ],
  templateUrl: './view-activity-page.component.html',
  styleUrl: './view-activity-page.component.css'
})
export class ViewActivityPageComponent {
  constructor(private CS: CommunicationService, private route: ActivatedRoute) {}

  activity: Activity = {
    typeOfActivity: '',
    activityName: '',
    responsibles: [],
    executionDate: new Date(),
    executionWeek: 1,
    announcementDate: new Date(),
    reminderDates: 0,
    comments: [],
    isRemote: false,
    virtualActivityLink: '',
    activityPoster: '',
    currentState: ''
  };

  userIsCordinator: boolean = false;
  activityId: string = '';
  actualUser: {id: string, isTeacher: boolean} = {id: "", isTeacher: true}


  ngOnInit() {
    this.actualUser = this.CS.getActualUser();
    this.CS.getProfessor(this.actualUser.id).subscribe(
      prof => {
        if(prof.account.isCordinator){
          this.userIsCordinator = true
        }
      }
    )
    this.route.params.subscribe(params => {
      this.activityId = params['id'];
      this.CS.getActivity(this.activityId).subscribe(res =>{
        this.getData(res);
      })
    });
  }

  getResponsiblesNames(ActivityRequest: any){
    let responsiblesNames: string[] = [];
    for ( let responsibleIndex in ActivityRequest.activity.responsibles){
      this.CS.getProfessor(ActivityRequest.activity.responsibles[responsibleIndex]).subscribe(res => {
        responsiblesNames.push(res.account.name.firstName + ' ' + res.account.name.firstSurname);
        console.log(responsiblesNames);
      });
    }
    console.log(responsiblesNames);
    return responsiblesNames;
  }

  prettyPrintDate(dateString: Date): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return date.toLocaleDateString('es-ES', options);
  }

  getData(ActivityRequest: any) {
      const typeOfActivity = ActivityRequest.activity.typeOfActivity;
      const activityName = ActivityRequest.activity.activityName;
      const responsibles = this.getResponsiblesNames(ActivityRequest);
      const executionDate = ActivityRequest.activity.executionDate;
      const executionWeek = ActivityRequest.activity.executionWeek;
      const announcementDate = ActivityRequest.activity.announcementDate;
      const reminderDates = ActivityRequest.activity.reminderDates;
      const comments = ActivityRequest.activity.comments;
      const isRemote = ActivityRequest.activity.isRemote;
      const virtualActivityLink = ActivityRequest.activity.virtualActivityLink;
      const activityPoster = ActivityRequest.activity.activityPoster;
      const currentState = ActivityRequest.activity.currentState;
      this.activity = { typeOfActivity, activityName, responsibles, executionDate, executionWeek, announcementDate, reminderDates, comments, isRemote, virtualActivityLink, activityPoster, currentState };
  }


}
