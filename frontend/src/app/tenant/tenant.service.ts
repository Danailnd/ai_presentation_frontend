import { Injectable } from '@angular/core';
import { Tenant } from './tenant.model';
import { HttpsService } from '../../services/https.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  private apiUrl = 'tenant';

  constructor(private httpService: HttpsService) {}

  // Add a new book
  addTenant(newTenant: Tenant): Observable<Tenant> {
    return this.httpService.post<Tenant>(this.apiUrl, newTenant);
  }

  // Get all books
  getTenants(): Observable<Tenant[]> {
    return this.httpService.get<Tenant[]>(this.apiUrl);
  }
}
