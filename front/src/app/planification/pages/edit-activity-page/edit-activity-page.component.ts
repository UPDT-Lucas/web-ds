import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CheckboxInputComponent } from '../../../shared/components/checkbox-input/checkbox-input.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FileInputComponent } from '../../../shared/components/file-input/file-input.component';
import { S3ApiService } from '../../../s3-api.service';
import { CommunicationService } from '../../../services/communication.service';
import { ActivatedRoute } from '@angular/router';
import { Activity } from '../../../interfaces/activity.interface';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-edit-activity-page',
  standalone: true,
  imports: [
    HeaderComponent,
    ButtonComponent,
    CheckboxInputComponent,
    InputComponent,
    FileInputComponent,
    DatePickerComponent
  ],
  templateUrl: './edit-activity-page.component.html',
  styleUrl: './edit-activity-page.component.css'
})
export class EditActivityPageComponent {

  constructor(private s3ApiService: S3ApiService, private CS: CommunicationService, private route:ActivatedRoute) {}
  
  filename: string = "assets/images/saludMental.jpg"

  typeOfActivity: string = 'Orientadora';
  activityName: string = '';
  responsibles!: string[];
  executionDate: string = '';
  executionWeek: number = 1;
  announcementDate: string = '';
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

  //Responsibles emails to get Ids
  professorEmails: string[] = []
  professorEmailsSet: Set<string> = new Set<string>()

  //Professor emails to show in the view
  professorEmailsToShow: string = ''


  activityId: string = '';
  Activity: any = {};

  isPresential: boolean = true;
  file!: any;

  ngOnInit(){
    this.route.params.subscribe(
      params => {
        this.activityId = params["id"]  
        this.CS.getActivity(this.activityId).subscribe(
          (activityRequest: any) => {
            if(activityRequest){
              this.Activity = activityRequest.activity
              this.typeOfActivity = this.Activity.typeOfActivity;
              this.activityName = this.Activity.activityName;
              this.responsibles = this.Activity.responsibles;
              this.showProfessorEmails(this.responsibles);
              this.executionDate = this.Activity.executionDate;
              this.executionWeek = this.Activity.executionWeek;
              //Put the execution week in the input
              this.inputExecutionWeek = this.executionWeek.toString();
              this.announcementDate = this.Activity.announcementDate;
              this.reminderDates = this.Activity.reminderDates;
              //Put the execution week in the input
              this.inputReminderDates = this.reminderDates.toString();
              this.comments = this.Activity.comments;
              this.isRemote = this.Activity.isRemote;
              this.virtualActivityLink = this.Activity.virtualActivityLink;
              this.activityPoster = this.Activity.activityPoster;
              this.currentState = this.Activity.currentState;
            }
          }
        )
      }
    )
  }

  showProfessorEmails(responsibles: string[]){
    for(let i = 0; i < responsibles.length; i++){
      this.CS.getProfessor(responsibles[i]).subscribe(
        (professorRequest: any) => {
          this.professorEmailsToShow += (professorRequest.account.email + ', ')
          this.inputResponsibles = this.professorEmailsToShow
          console.log(this.professorEmailsToShow)
        }
      )
    }
  }

  onAcivityTypeChange(event: any){
    const selectedActivityType = event?.target?.value;
    if(selectedActivityType){
      this.typeOfActivity = selectedActivityType;
    }
  }

  getFile(file: any) {
    this.file = file;
  }


  getData() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      this.s3ApiService.uploadFile(formData).subscribe(
        (res) => {
          this.updateImage(this.file.name).subscribe(() => {
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
    let correctFormat = true
    this.inputResponsibles = this.inputResponsibles.trim()
    if(this.inputResponsibles.endsWith(',')){
      this.inputResponsibles = this.inputResponsibles.slice(0, -1)
    }
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
    this.professorEmailsSet.forEach(email => {
      // console.log("AAAAA ", email)
      this.CS.getProfessorByEmail(email).subscribe(
        (res: any) => {
          if(res){
            this.responsibles.push(res._id)
          } else {
            // console.log("No se encontró el profesor")
          }
        }
      )
    });
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

    this.loadProfessorsByEmails()

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
      console.log(activityData)
      this.CS.editActivity(this.activityId, activityData).subscribe(
        (res: any) => {
          console.log(res)
        }
      )
    } else {
      console.log("Error en el formato de los datos ingresados")
    }
  }
}
