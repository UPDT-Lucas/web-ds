import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CheckboxInputComponent } from '../../../shared/components/checkbox-input/checkbox-input.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { S3ApiService } from '../../../s3-api.service';
import { Activity } from '../../../interfaces/activity.interface';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { CommunicationService } from '../../../services/communication.service';
import { map } from 'rxjs';
import { Professor } from '../../../interfaces/professor.interface';

@Component({
  selector: 'app-add-activity-page',
  standalone: true,
  imports: [
    ButtonComponent,
    HeaderComponent,
    CheckboxInputComponent,
    InputComponent,
    FileInputComponent,
    DatePickerComponent
  ],
  templateUrl: './add-activity-page.component.html',
  styleUrl: './add-activity-page.component.css'
})
export class AddActivityPageComponent {
  constructor(private s3ApiService: S3ApiService, private CS: CommunicationService ) {}
  filename: string = ""
  file!: any;

  typeOfActivity: string = 'Orientadora';
  activityName: string = '';
  responsibles: string[] = [];
  executionDate: string = new Date().toISOString();
  executionWeek: number = 1;
  announcementDate: string = new Date().toISOString();
  reminderDates: number = 0;
  comments: string[] = [];
  isRemote: boolean = false;
  virtualActivityLink: string = '';
  activityPoster: string = '';
  currentState: string = 'Planeada';


  //Input string variables to treat the data
  inputExecutionWeek: string = '';
  inputReminderDates: string = '';
  inputResponsibles: string = '';

  //Responsibles emails
  professorEmails: string[] = []
  professorEmailsSet: Set<string> = new Set<string>()

  getFile(file: any) {
    this.file = file;
  }


  getData() {
    // this.uploadActivity();
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      this.s3ApiService.uploadFile(formData).subscribe(
        (res) => {
          this.updateImage(this.file.name).subscribe(() => {
            // console.log(res)
            this.uploadActivity();
          });
        }
      );
    }
  }

  updateImage(filename: string) {
    return this.s3ApiService.getFileByName(filename).pipe(
      map(res => {
        this.filename = res!.result;
      })
    );
  }

  onAcivityTypeChange(event: any){
    const selectedActivityType = event?.target?.value;
    if(selectedActivityType){
      this.typeOfActivity = selectedActivityType;
    }
  }


  getDaysDifference(dateString1: string, dateString2: string): number {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);
    
    // Calculate the difference in milliseconds
    const differenceMs = date1.getTime() - date2.getTime();
    
    // Convert the difference to days
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
    
    return differenceDays;
  }
  checkDates(){
    let daysDiff = this.getDaysDifference(this.executionDate, this.announcementDate)
    if(daysDiff < 0){
      // console.log("La fecha de anuncio no puede ser después de la fecha de ejecución")
      return false
    }
    if(this.reminderDates > daysDiff){
      // console.log("La fecha de recordatorio no puede ser después de la fecha de anuncio")
      return false
    }
    return true
  }

  checkResponsibles(){
    console.log("pasa")
    let correctFormat = true
    let responsibles = this.inputResponsibles.split(',')
    responsibles.forEach(responsible => {
      responsible = responsible.trim()
      if(responsible.length < 3){
        correctFormat = false
      }
      if(!responsible.includes('@')){
        correctFormat = false
      }
      if(this.professorEmailsSet.has(responsible)){
      } else {
        this.professorEmailsSet.add(responsible)
        this.professorEmails.push(responsible)
        // console.log(this.professorEmails)
      }
    });
    return correctFormat
  }

  loadProfessorsByEmails(){
    // console.log(this.professorEmailsSet)
    console.log(this.professorEmails)
    this.professorEmails.forEach(email => {
      // console.log("AAAAA ", email)
      this.CS.getProfessorByEmail(email).subscribe(
        (res: Professor) => {
          if(res){
            console.log("id")
            console.log(res.account._id)
            this.responsibles.push(res.account._id)
            this.createActivity()
            
          } else {
            console.log("No se encontró el profesor")
          }
        }
      )
    });
    console.log("estos hay")
    console.log(this.responsibles)
    console.log(this.responsibles.length)
  }
  
  createActivity(){
    const activityData: Activity = {
      typeOfActivity: this.typeOfActivity,
      activityName: this.activityName,
      responsibles: this.responsibles,
      executionDate: new Date(this.executionDate),
      executionWeek: Number(this.inputExecutionWeek),
      announcementDate: new Date(this.announcementDate),
      reminderDates: Number(this.inputReminderDates),
      comments: [],
      isRemote: this.isRemote,
      virtualActivityLink: this.virtualActivityLink,
      activityPoster: this.filename,
      currentState: this.currentState
    }
    this.CS.registerActivity(activityData).subscribe(
      (res: any) => {
        console.log(res)
      }
    )
  }

  checkInputs() {
    this.professorEmailsSet.clear()
    this.professorEmails = []
    this.responsibles = []
    let correctFormat = true
    if(this.activityName == '' || this.executionDate == '' || this.announcementDate == ''){
       console.log("a")
      correctFormat = false;
    }
    console.log(this.checkResponsibles(), this.checkDates())
    if(!this.checkResponsibles() || !this.checkDates()) {
       console.log("aa")
      correctFormat = false;
    }

    if(Number(this.inputExecutionWeek) < 1 || Number(this.inputExecutionWeek) > 19 || Number.isNaN(parseFloat(this.inputExecutionWeek))){
       console.log("A")
      correctFormat = false;
    }
    if(Number(this.inputReminderDates) < 0 || Number(this.inputReminderDates) > 60 || Number.isNaN(parseFloat(this.inputReminderDates))){
       console.log("AA")
      correctFormat = false;
    }

    return correctFormat
    
  }

  uploadActivity(){
    if(this.checkInputs()){
      this.loadProfessorsByEmails()
    } else {
      console.log("Error en el formato de los datos ingresados")
    }
  }
}
