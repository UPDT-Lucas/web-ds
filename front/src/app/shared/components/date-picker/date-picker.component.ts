import { Component, EventEmitter, Input } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Output } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';



@Component({
  selector: 'shared-date-picker',
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, // Use 'es-ES' for Spanish locale
    provideNativeDateAdapter(),
  ],
  imports: [
    MatFormFieldModule,
     MatInputModule, 
     MatDatepickerModule,
     FormsModule,
     ReactiveFormsModule
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent {

  constructor(private CS: CommunicationService){

  }

  @Input()
  value: string | null = null;

  @Input()
  typeOfDate: string = '';

  @Input()
  entry!: string;

  @Output()
  entryChange = new EventEmitter<string>();

  formsDate = new FormControl(new Date());
  

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
       this.formsDate = new FormControl(event.value);
       if (this.formsDate.value !== null) {
         this.entryChange.emit(this.formsDate.value.toISOString());
       }
    }
  }

  ngOnInit(){
    let activityId = this.value;
    if(activityId == null) return;
    this.CS.getActivity(activityId).subscribe(
      (activityRequest: any) => {
        if(activityRequest){
          if(this.typeOfDate == 'executionDate'){
            let executionDate = activityRequest.activity.executionDate;
            this.formsDate = new FormControl(new Date(executionDate));
          } else if(this.typeOfDate == 'announcementDate'){
            let announcementDate = activityRequest.activity.announcementDate;
            this.formsDate = new FormControl(new Date(announcementDate));
          } else {
            this.formsDate = new FormControl(new Date());
          }
        }
      }
    )  
  }

  

}
