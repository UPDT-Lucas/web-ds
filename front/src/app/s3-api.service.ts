import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { File } from './interfaces/file.interface';

@Injectable({
  providedIn: 'root'
})
export class S3ApiService {
  private baseURL = 'https://ds-backend.up.railway.app';
  

  constructor(private httpClient: HttpClient) {}

  getFiles(): Observable<File[] | undefined> {
    return this.httpClient.get<File[]>(`${this.baseURL}/files`)
    .pipe(
      catchError(error => of(undefined))
    )
  }

  getFileByName(filename: string): Observable<any | undefined> {
    return this.httpClient.get<any>(`${this.baseURL}/files/${filename}`)
    .pipe(
      catchError(error => of(undefined))
    )
  }

  uploadFile(formData: FormData): Observable<any | undefined> {
    return this.httpClient.post<File>(`${this.baseURL}/files`, formData)
  }

  
}
