import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../interfaces/student.interface'
import { S } from '@fullcalendar/core/internal-common';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = 'http://localhost:3000'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) { }

  registerProfessor(): Observable<Student> {
    const student = {
      "firstName": "Juan",
      "secondName": "Doe",
      "firstSurname": "Smith",
      "secondSurname": "Johnson",
      "email": "juan@example.com",
      "campus": "6630576f3ee524ad51bd5b09",
      "cellPhone": "22478963",
      "carnet": "2019089068"}
      
    const url = `${this.apiUrl}/register-student`; 
    const formData = new FormData();

    const httpOption = {
       headers: new HttpHeaders({
        'Content-Type': 'application/json'
       }) 
    }
    console.log(student)
    return this.http.post<Student>(url, student, httpOption);
  }
 
}