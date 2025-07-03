import { Component } from '@angular/core';
import { DefaultPaperComponent } from '../../shared/default.paper/default.paper.component';
import { HomeServiceButtonComponent } from '../home-service-button/home-service-button.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpsService } from '../../services/https.service';

@Component({
  selector: 'app-home-page',
  imports: [DefaultPaperComponent, HomeServiceButtonComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  constructor(
    private router: Router,
    private httpsService: HttpsService,
    private authService: AuthService
  ) {}

  onTenantButtonClicked(): void {
    this.router.navigate(['/tenants']);
  }

  onService1ButtonClicked(): void {
    console.log('Service 1 button clicked');
    // Add your logic for handling this button click
  }

  onService2ButtonClicked(): void {
    console.log('Service 2 button clicked');
    // Add your logic for handling this button click
  }

  onTestBackendButtonClicked(): void {
    console.log('Test Backend button clicked');

    // Call backend API
    this.httpsService.get('test/admin').subscribe({
      next: (response) => {
        console.log('Response from backend:', response);
      },
      error: (error) => {
        console.error('Error calling backend:', error);
      },
      complete: () => {
        console.log('Request completed');
      },
    });
  }

  logTokenInfo(): void {
    const account = this.authService.activeAccount;
    if (account) {
      console.log('ID Token Claims:', account.idTokenClaims);
      console.log('Full Account Info:', account);
    } else {
      console.warn('No active account found.');
    }
  }
  onTestUserButtonClicked(): void {
    this.httpsService.get('test/user').subscribe({
      next: (response) => {
        console.log('Response from backend:', response);
      },
      error: (error) => {
        console.error('Error calling backend:', error);
      },
      complete: () => {
        console.log('Request completed');
      },
    });
  }
}
