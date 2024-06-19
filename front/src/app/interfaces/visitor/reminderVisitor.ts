import { Activity } from "../activity.interface";
import { Visitor } from "./visitor.interface";
import { CommunicationService } from "../../services/communication.service";

export class ReminderVisitor implements Visitor {
    currentDate: Date;

    constructor(currentDate: Date, communicationService: CommunicationService) {
        this.currentDate = currentDate;
    }

    visit(activity: Activity) {
        if (activity.currentState == "Notificada") {
            const reminderInterval = activity.reminderDates;
            const announcementDate = new Date(activity.announcementDate);
            const executionDate = new Date(activity.executionDate);

            const diffTime = Math.abs(this.currentDate.getTime() - announcementDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const reminderNumber = Math.floor(diffDays / reminderInterval);
            
            if (diffDays % reminderInterval === 0 && this.currentDate < executionDate) {
                return {
                    type: 'reminder',
                    message: `Recordatorio ${reminderNumber}: La actividad ${activity.activityName} está próxima a realizarse.`,
                };
            }
        } else if (activity.currentState == "Cancelada") {
            return {
                type: 'cancellation',
                message: `La actividad ${activity.activityName} ha sido cancelada.`,
            };
        }
        return null;
    }
}

