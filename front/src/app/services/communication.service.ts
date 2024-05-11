import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Professor } from '../interfaces/professor.interface';


@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3000';


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

}

