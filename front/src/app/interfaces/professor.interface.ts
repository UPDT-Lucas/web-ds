export interface Professor {
    account: Account;
}

export interface Account {
    name:        Name;
    username:    string;
    email:       string;
    campus:      string;
    cellPhone:   string;
    officePhone: string;
    //isCordinator: string;
}

export interface Name {
    firstName:     string;
    secondName:    string;
    firstSurname:  string;
    secondSurname: string;
}
