import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ButtonComponent } from '../../../shared/button/button.component';
import { SnackbarService } from '../../../services/snackbar.service';
import { Tenant } from '../tenant.model';

@Component({
  selector: 'app-tenant-content-overview',
  imports: [
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    ButtonComponent,
  ],
  templateUrl: './tenant-content-overview.component.html',
  styleUrl: './tenant-content-overview.component.scss',
})
export class TenantContentOverviewComponent {
  @Input() tenant: Tenant | null = null;

  constructor(private snackbarService: SnackbarService) {}

  handleActivate() {
    this.snackbarService.show(
      'Tenant activated successfully!',
      'Close',
      3000,
      'success'
    );
  }

  handleUnlock() {
    this.snackbarService.show('Tenant unlocked.', 'Close', 3000, 'info');
  }

  handleDelete() {
    this.snackbarService.show(
      'Tenant has been deleted.',
      'Close',
      3000,
      'error'
    );
  }
}
