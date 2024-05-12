export interface PorfessorList {
    professors: Professor[];
}

export interface Professor {
    security:      Security;
    _id:           string;
    firstName:     string;
    secondName:    string;
    firstSurname:  string;
    secondSurname: string;
    email:         string;
    campus:        string;
    password:      string;
    cellPhone:     string;
    officePhone:   string;
    isCordinator:  boolean;
    createdAt:     Date;
    updatedAt:     Date;
    __v:           number;
}

export interface Security {
    emailVerificationToken: string;
}
