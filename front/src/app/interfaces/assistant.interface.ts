export interface AssistantResponse {
    assistant: Assistant;
}

export interface Assistant {
    security:      Security;
    _id:           string;
    firstName:     string;
    secondName:    string;
    firstSurname:  string;
    secondSurname: string;
    email:         string;
    code:          string;
    campus:        string;
    password:      string;
    cellPhone:     string;
    officePhone:   string;
    createdAt:     Date;
    updatedAt:     Date;
    __v:           number;
}

export interface Security {
    emailVerificationToken: string;
}
