import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Professor } from '../interfaces/professor.interface';
import { Student } from '../interfaces/student.interface';
import { Activity } from '../interfaces/activity.interface';
import { Assistant } from '../interfaces/assitant.interface'

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  constructor(private http: HttpClient) {}  
  private apiUrl = 'http://localhost:3000';

  //----------------------------------------- PROFESSOR -----------------------------------------//
  login(email: string, pass: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {"email": email, "password": pass});
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, {"email": email});
  }

  verifyOtp(id: string, otp: string, confirmation: string) {
    const url = `${this.apiUrl}/verify-otp/${id}`;
    return this.http.post(url, { otp, confirmation });
  }

  resetPassword(id: string, newPassword: string, confirmPassword: string) {
    const url = `${this.apiUrl}/reset-password/${id}`;
    return this.http.post(url, {newPassword, confirmPassword})
  }

  getProfessor(id: string): Observable<Professor> {
    const url = `${this.apiUrl}/getProfessor/${id}`;
    return this.http.get<Professor>(url);
  }

  editAccount(id: string, professorData: any): Observable<Professor> {
    const url = `${this.apiUrl}/editAccount/${id}`;
    return this.http.put<Professor>(url, professorData);
  }


  registerProfessor(professorData: any): Observable<Professor> {
    console.log("la data")
    console.log(professorData)
    const url = `${this.apiUrl}/register-professor`; 
    return this.http.post<Professor>(url, professorData); 
  }

  getAllProfessor(limit: number, skip: number): Observable<Professor[] | any> {
    const url = `${this.apiUrl}/all-professor?limit=${limit}&skip=${skip}`;

    return this.http.get<Professor[]>(url); 
  }

  getProfessorByName(name: string, limit: number, skip: number): Observable<Professor | any> {
    const url = `${this.apiUrl}/getProfessorByName?name=${name}&limit=${limit}&skip=${skip}`
    return this.http.get<Professor>(url)
  }
  getProfessorByCampus(campus: string, limit: number, skip: number): Observable<Professor | any> {
    const url = `${this.apiUrl}/getProfessorByCampus?campus=${campus}&limit=${limit}&skip=${skip}`
    return this.http.get<Professor>(url)
  }
  
  getProfessorByEmail(email: string): Observable<Professor> {
    const url = `${this.apiUrl}/getProfessorByEmail/${email}`;
    return this.http.get<Professor>(url);
  }

  getCampusById(id: string): string {
    if (
      id == "663057863ee524ad51bd5b0f"
    ){return "San José"}
    else if (
      id == "663057633ee524ad51bd5b05"
    ){return "Cartago"}
    else if (
      id == "6630576f3ee524ad51bd5b09"
    ){return "Alajuela"}
    else if (
      id == "6630578f3ee524ad51bd5b12"
    ){return "Limón"}
    else 
    {return "San Carlos"}
  }

  deleteProfessor(id: string): Observable<Professor> {
    const url = `${this.apiUrl}/delete-professor/${id}`;
    return this.http.delete<Professor>(url);
  }




  //----------------------------------------- STUDENT -----------------------------------------//
  registerStudent(studentData: any): Observable<Student> {
    const url = `${this.apiUrl}/register-student`; 
    return this.http.post<Student>(url, studentData); 
  }

  getAllStudent(): Observable<Student[]  | any> {
    const url = `${this.apiUrl}/all-student`; 
    return this.http.get<Student[]>(url); 
  }

  getStudentByName(name: string, limit: number, skip: number): Observable<Student | any> {
    const url = `${this.apiUrl}/getStudentByName?name=${name}&limit=${limit}&skip=${skip}`
    return this.http.get<Student>(url)
  }

  editAccountStudent(id: string, studentData: any): Observable<Student> {
    const url = `${this.apiUrl}/editAccountStudent/${id}`;
    return this.http.put<Student>(url, studentData);
  }

  getStudent(id: string): Observable<Student> {
    const url = `${this.apiUrl}/getStudent/${id}`;
    return this.http.get<Student>(url);
  }


  //----------------------------------------- ACTIVITY -----------------------------------------//
  getAllActivities(): Observable<Activity[]> {
    const url = `${this.apiUrl}/all-activities`; 
    return this.http.get<Activity[]>(url); 
  }

  getActivity(id: string): Observable<Activity> {
    const url = `${this.apiUrl}/getActivity/${id}`; 
    return this.http.get<Activity>(url); 
  }


  registerActivity(activityData: any): Observable<Activity> {
    const url = `${this.apiUrl}/register-activity`; 
    return this.http.post<Activity>(url, activityData); 
  }

  //----------------------------------------- ASSISTANT -----------------------------------------//

  loginAssistant(email: string, pass: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/loginAssistant`, {"email": email, "password": pass});
  }

}

