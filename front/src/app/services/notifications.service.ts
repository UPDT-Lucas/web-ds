import { Injectable } from '@angular/core';
import { CommunicationService } from './communication.service';
import { NotificationCenter } from '../interfaces/observer/notificationCenter';
import { Activity } from '../interfaces/activity.interface';
import { PublishVisitor } from '../interfaces/visitor/publishVisitor';
import { ReminderVisitor } from '../interfaces/visitor/reminderVisitor';
import { StudentObserver } from '../interfaces/observer/studentObserver';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private communicationService: CommunicationService,
  ) {}

  // Método para manejar cambios en el estado de las actividades y notificar a los observadores
  handleActivityStateChange(student: any): void {
    const currentDate = new Date();
    const notificationCenter = new NotificationCenter();
    notificationCenter.addObserver(new StudentObserver(student, this.communicationService))
    this.communicationService.getAllActivities().subscribe(
      (response: any) => {
        response.activities.forEach((activity: Activity) => {
          const publishVisitor = new PublishVisitor(currentDate);
          const reminderVisitor = new ReminderVisitor(currentDate);
          const publishResult = publishVisitor.visit(activity);
          const reminderResult = reminderVisitor.visit(activity);
          if (publishResult) {
            notificationCenter.notify(publishResult.message);
          }
          if (reminderResult) {
            notificationCenter.notify(reminderResult.message);
          }
        });
      }
    )
  }

}
