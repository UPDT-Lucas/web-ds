import { Student } from "../student.interface";
import { StudentObserver } from "./studentObserver";

export class NotificationCenter {
    observers: StudentObserver[];

    constructor() {
        this.observers = [];
    }

    addObserver(observer: any) {
        this.observers.push(observer);
    }

    removeObserver(observer: StudentObserver) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(message: string) {
        this.observers.forEach((observer: StudentObserver) => observer.update(message));
    }
}
