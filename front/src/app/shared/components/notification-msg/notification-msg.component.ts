import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../../../interfaces/professor.interface';
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

  @Input()
  user: string = '';

  @Input()
  notification!: Notification;

  @Input()
  checked: boolean = false;

  @Input()
  index: number = 0;

  @Output()
  stateChange = new EventEmitter<boolean>();

  onStateChange(){
    this.stateChange.emit(!this.checked)
  }

  ngOnInit(){
    const user = this.communicationService.getActualUser()
    this.actualId = user.id
  }

  changeState(){
    this.communicationService.updateNotification(this.actualId, this.notification._id, !this.checked).subscribe()
  }
}
