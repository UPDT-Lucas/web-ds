import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable  } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3000';


  login(email: string, pass: string): Observable<any> {
    return this.http.post(`/api/login`, {"email": email, "password": pass});
  }

  registerProfessor(body: FormData): Observable<any> {
    return this.http.post('/api/register-professor', body);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, {"email": email});
  }


}