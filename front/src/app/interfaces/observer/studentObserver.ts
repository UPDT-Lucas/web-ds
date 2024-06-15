import { CommunicationService } from "../../services/communication.service";
import { Student } from "../student.interface";

export class StudentObserver {
    student: any;  

    constructor
    (
        student: Student, 
        private communicationService: CommunicationService,
        // private notificationCenter: NotificationCenter
    ) {
      this.student = student;
    //   this.notificationCenter.addObserver(this.student)
    }
  
    update(message: string) { 
      const notification = {
        text: message,
        date: new Date(),
        seen: false
      };
      this.communicationService.addNotification(this.student.account.id, notification).subscribe(
        (response: any) => {
          console.log('Notificación enviada exitosamente:', response);
        }
      );
    }
  }