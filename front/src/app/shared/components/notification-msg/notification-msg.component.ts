import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../../../interfaces/student.interface';
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'shared-notification-msg',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './notification-msg.component.html',
  styleUrl: './notification-msg.component.css'
})
export class NotificationMsgComponent {

  constructor(private communicationService: CommunicationService){}

  actualId: string = ''
  disabled: boolean = false

  @Input()
  user: string = '';

  @Input()
  notification!: Notification;

  @Input()
  checked: boolean = false;

  @Input()
  index: number = 0;

  ngOnInit(){
    const user = this.communicationService.getActualUser()
    this.actualId = user.id
  }

  changeState(){
    this.checked = !this.checked
    this.communicationService.updateNotification(this.actualId, this.notification._id, this.checked, this.disabled).subscribe()
  }

  deleteNotification(){
    this.disabled = !this.disabled
    this.communicationService.updateNotification(this.actualId, this.notification._id, this.checked, this.disabled).subscribe()
  }
}
