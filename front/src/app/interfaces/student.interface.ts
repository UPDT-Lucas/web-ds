export interface Student {
    account: Account;
}

export interface Account {
    _id: string;
    name: Name;
    carnet: string;
    email: string;
    campus: string;
    cellPhone: string;
    photo: string;
    notifications: Notification[]
}

export interface Name {
    firstName: string;
    secondName: string;
    firstSurname: string;
    secondSurname: string;
}

export interface Notification {
    text: string;
    date: Date;
    seen: boolean;
    _id: string;
    disabled: boolean;
}