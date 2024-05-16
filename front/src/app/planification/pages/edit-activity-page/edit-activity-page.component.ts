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

  //Responsibles emails
  professorEmails: string[] = []
  professorEmailsSet: Set<string> = new Set<string>()

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
              this.executionDate = this.Activity.executionDate;
              this.executionWeek = this.Activity.executionWeek;
              this.announcementDate = this.Activity.announcementDate;
              this.reminderDates = this.Activity.reminderDates;
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

  onAcivityTypeChange(event: any){
    const selectedActivityType = event?.target?.value;
    if(selectedActivityType){
      this.typeOfActivity = selectedActivityType;
    }
  }

  getFile(file: any) {
    this.file = file;
  }

  test(){
    console.log(this.Activity)
  }

  getData(){
    const formData = new FormData();
    formData.append('file', this.file);

    this.s3ApiService.uploadFile(formData).subscribe(
     (res) => {
        this.updateImage(this.file.name)
      }
    )
  }

  
  updateImage(filename: string){
    this.s3ApiService.getFileByName(filename).subscribe(
      res => {
        this.filename = res!.result
      }
    )
  }
}
