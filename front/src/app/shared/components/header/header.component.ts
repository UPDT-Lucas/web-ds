import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { RouterModule } from '@angular/router';
import { NotificationMsgComponent } from '../notification-msg/notification-msg.component';
import { CommunicationService } from '../../../services/communication.service';
import { NotificationCenter } from '../../../interfaces/observer/notificationCenter';
import { NotificationsService } from '../../../services/notifications.service';
import { Notification } from '../../../interfaces/professor.interface';

@Component({
  selector: 'shared-header',
  standalone: true,
  imports: [
    ButtonComponent,
    RouterModule,
    NotificationMsgComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  date: Date = new Date()

  @Input()
  isTeacher: boolean = true

  isFilter: boolean = false

  isViewed: boolean = false

  state: boolean = false

  allNotifications: Notification[] = []
  notifications: Notification[] = []
  seenNotifications: Notification[] = []
  notSeenNotifications: Notification[] = []

  constructor(router: RouterModule, private communicationService: CommunicationService,
    private notificationService: NotificationsService
  ) {}

  ngOnInit(){
    const user = this.communicationService.getActualUser()
    const actualId = user.id
    // this.communicationService.getStudent(actualId).subscribe(
    //   student => {
    //     console.log(student)
    //   }
    // )
    this.communicationService.getProfessor(actualId).subscribe(
      professor => {
        if(professor){
          this.notificationService.handleActivityStateChange(professor)
          this.allNotifications = professor.account.notifications
          this.seenNotifications = this.allNotifications.filter((notif) => notif.seen)
          this.notSeenNotifications = this.allNotifications.filter((notif) => !notif.seen)
          this.notifications = this.allNotifications
        }
      }
    )
  }

  toggleView(){
    this.isViewed = !this.isViewed
    if(this.isViewed){
      this.seenNotifications = this.allNotifications.filter((notif) => notif.seen)
      this.notifications = this.seenNotifications

    }else{
      this.notSeenNotifications = this.allNotifications.filter((notif) => !notif.seen)
      this.notifications = this.notSeenNotifications
    }
  }

  toggleFilter(){
    this.isFilter = !this.isFilter
    if(!this.isFilter){
      this.notifications = this.allNotifications
    }
  }
}
