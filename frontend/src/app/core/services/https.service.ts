import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChangeMetadata } from '../models/change.metadata';

/**
 * Supported HTTP methods:
 * - GET
 * - POST
 * - PATCH
 */
@Injectable({
  providedIn: 'root',
})
export class HttpsService {
  private apiUrl = environment.apiConfig.uri;

  private defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) {}

  /**
   * Sends a POST request to the specified endpoint with a JSON body.
   *
   * @param endpoint Relative endpoint path (e.g., '/users/create')
   * @param body Request body payload
   * @returns Observable of the typed response
   */
  post<T>(endpoint: string, body: T, metadata?: ChangeMetadata): Observable<T> {
    const headers = this.buildHeaders(metadata);
    return this.httpClient.post<T>(`${this.apiUrl}${endpoint}`, body, {
      headers,
    });
  }

  /**
   * Sends a GET request to the specified endpoint.
   *
   * @param endpoint Relative endpoint path (e.g., '/users')
   * @returns Observable of the typed response
   */
  get<T>(endpoint: string): Observable<T> {
    return this.httpClient.get<T>(`${this.apiUrl}${endpoint}`, {
      headers: this.defaultHeaders,
    });
  }

  /**
   * Sends a PATCH request to update a resource partially.
   *
   * @param endpoint Relative endpoint path (e.g., '/users/123')
   * @param body Partial update object containing only fields to change
   * @returns Observable of the updated resource
   */
  patch<T>(
    endpoint: string,
    body: Partial<T>,
    metadata?: ChangeMetadata
  ): Observable<T> {
    const headers = this.buildHeaders(metadata);
    return this.httpClient.patch<T>(`${this.apiUrl}${endpoint}`, body, {
      headers,
    });
  }

  private buildHeaders(metadata?: ChangeMetadata): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    console.log('Building headers with metadata:', metadata);

    if (metadata?.reason?.trim()) {
      headers = headers.set('Change-Reason', metadata.reason.trim());
    }

    if (metadata?.ticketId?.trim()) {
      headers = headers.set('Ticket-ID', metadata.ticketId.trim());
    }

    return headers;
  }
}
