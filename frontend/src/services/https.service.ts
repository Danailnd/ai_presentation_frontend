import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpsService {
  private apiUrl = 'https://localhost:5000/api/';

  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) {}

  post<T>(endpoint: string, body: T): Observable<T> {
    return this.httpClient.post<T>(`${this.apiUrl}${endpoint}`, body, {
      headers: this.headers,
    });
  }

  get<T>(endpoint: string): Observable<T> {
    return this.httpClient.get<T>(`${this.apiUrl}${endpoint}`, {
      headers: this.headers,
    });
  }
}
