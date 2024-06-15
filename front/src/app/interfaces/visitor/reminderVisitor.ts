import { Activity } from "../activity.interface";
import { Visitor } from "./visitor.interface";

export class ReminderVisitor implements Visitor {
    currentDate: Date;

    constructor(currentDate: Date) {
        this.currentDate = currentDate;
    }

    visit(activity: Activity) {
        const reminderInterval = activity.reminderDates;
        const announcementDate = new Date(activity.announcementDate);

        const diffTime = Math.abs(this.currentDate.getTime() - announcementDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays % reminderInterval === 0) {
            return {
                type: 'reminder',
                message: `Recordatorio: La actividad ${activity.activityName} está próxima a realizarse.`,
            };
        }
        return null;
    }
}

