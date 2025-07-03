import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { DefaultPaperComponent } from '../../../shared/default.paper/default.paper.component';

@Component({
  selector: 'app-tenant-creation-page',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    DefaultPaperComponent,
    MatIconModule,
  ],
  templateUrl: './tenant-creation-page.component.html',
  styleUrl: './tenant-creation-page.component.scss',
})
export class TenantCreationPageComponent {
  constructor(private router: Router) {}
  goBack(): void {
    this.router.navigate(['/tenants']);
  }
}
