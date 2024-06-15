export interface Professor {
    account: Account;
}

export interface Account {
    _id:         string;
    name:        Name;
    username:    string;
    email:       string;
    campus:      string;
    cellPhone:   string;
    officePhone: string;
    photo:       string;
    code:        string;
    isCordinator: boolean;
    notifications: Notification[]
}

export interface Name {
    firstName:     string;
    secondName:    string;
    firstSurname:  string;
    secondSurname: string;
}

export interface Notification {
    text: string;
    date: Date;
    seen: boolean;
    _id: string;
}