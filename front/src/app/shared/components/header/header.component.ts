import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { RouterModule } from '@angular/router';
import { NotificationMsgComponent } from '../notification-msg/notification-msg.component';
import { CommunicationService } from '../../../services/communication.service';
import { NotificationCenter } from '../../../interfaces/observer/notificationCenter';
import { NotificationsService } from '../../../services/notifications.service';
import { Notification } from '../../../interfaces/student.interface';

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
  role: string = ""

  isFilter: boolean = false

  isViewed: boolean = false
  actualId: string = ""

  allNotifications: Notification[] = []
  notifications: Notification[] = []
  seenNotifications: Notification[] = []
  notSeenNotifications: Notification[] = []

  constructor(router: RouterModule, private communicationService: CommunicationService,
    private notificationService: NotificationsService
  ) {}

  ngOnInit(){
    this.actualId = this.communicationService.getActualUser().id
    this.role = this.communicationService.getActualUser().role  
    if(this.role === 'student'){
      this.communicationService.getStudent(this.actualId).subscribe(
        student => {
          if(student){
            this.notificationService.handleActivityStateChange(student)
            this.allNotifications = student.account.notifications.filter((notif) => !notif.disabled)
            this.seenNotifications = this.allNotifications.filter((notif) => notif.seen && !notif.disabled) 
            this.notSeenNotifications = this.allNotifications.filter((notif) => !notif.seen && !notif.disabled)
            this.notifications = this.allNotifications
          }
        }
      )
    }
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
