import { Activity } from "../activity.interface";
import { Visitor } from "./visitor.interface";
import { CommunicationService } from "../../services/communication.service";

export class PublishVisitor implements Visitor {
    currentDate: Date;

    constructor(currentDate: Date, private communicationService: CommunicationService) {
        this.currentDate = currentDate;
    }

    visit(activity: any) {
        if ((new Date(activity.announcementDate) <= this.currentDate) && (new Date(activity.executionDate) >= this.currentDate)
            && (activity.currentState !== 'Notificada')) {
            activity.currentState = 'Notificada';

            this.communicationService.editActivity(activity._id! ,activity).subscribe(
                (response: any) => {
                    console.log('Actividad notificada:', response);
                }
            );
            return {
                type: 'announcement',
                message: `La actividad ${activity.activityName} ha sido anunciada.`,
            };
        }
        return null;
    }
}