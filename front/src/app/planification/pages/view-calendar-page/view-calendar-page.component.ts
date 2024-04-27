import { Component } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-view-calendar-page',
  standalone: true,
  imports: [
    CalendarComponent,
    HeaderComponent
  ],
  templateUrl: './view-calendar-page.component.html',
  styleUrl: './view-calendar-page.component.css'
})
export class ViewCalendarPageComponent {

}
