import { Activity } from "../activity.interface";
import { Visitor } from "./visitor.interface";

export class PublishVisitor implements Visitor {
    currentDate: Date;

    constructor(currentDate: Date) {
        this.currentDate = currentDate;
    }

    visit(activity: Activity) {
        if (activity.announcementDate && (new Date(activity.executionDate) >= this.currentDate)) {
            activity.currentState = 'notificada';
            return {
                type: 'announcement',
                message: `La actividad ${activity.activityName} ha sido notificada.`,
            };
        }
        return null;
    }
}