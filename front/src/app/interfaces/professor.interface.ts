export interface Professor {
    username: String;
    firstName: String;
    secondName?: String;
    firstSurname: String;
    secondSurname: String;
    email: String;
    campus: String;
    password: String;
    security: {
        resetPasswordOtp: String;
        emailVerificationToken: String;
    };
    cellPhone: String;
    officePhone?: String;
    photo?: String;
    isCordinator: Boolean;
}
