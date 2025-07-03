import { Component } from '@angular/core';
import { DefaultPaperComponent } from '../../shared/default.paper/default.paper.component';
import { HomeServiceButtonComponent } from '../home-service-button/home-service-button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [DefaultPaperComponent, HomeServiceButtonComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  constructor(private router: Router) {}

  onTenantButtonClicked(): void {
    this.router.navigate(['/tenants']);
  }
}
