import { Activity } from '../activity.interface';

export interface Visitor {
    visit(Activity: Activity): any
}