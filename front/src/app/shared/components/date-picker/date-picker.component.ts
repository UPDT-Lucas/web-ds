import { Component, EventEmitter, Input } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Output } from '@angular/core';



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

  constructor() { }

  @Input()
  value: string | null = null;

  @Input()
  entry!: string;

  @Output()
  entryChange = new EventEmitter<string>();

  formsDate = new FormControl(this.value);
  

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.formsDate = new FormControl(event.value.toISOString());
      if (this.formsDate.value !== null) {
        this.entryChange.emit(this.formsDate.value);
      }
    }
  }

  

}
