export interface Student {
    account: Account;
   }
   
   export interface Account {
       name:        Name;
       carnet:    string;
       email:       string;
       campus:      string;
       cellPhone:   string;
   }
   
   export interface Name {
       firstName:     string;
       secondName:    string;
       firstSurname:  string;
       secondSurname: string;
   }
   