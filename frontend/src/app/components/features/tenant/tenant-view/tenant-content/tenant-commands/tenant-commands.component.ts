import { Component } from '@angular/core';

import { ButtonComponent } from '../../../../../shared/button/button.component';
import { ConfirmationService } from '../../../../../../core/services/confirmation.service';
import { SnackbarService } from '../../../../../../core/services/snackbar.service';

@Component({
  selector: 'app-tenant-commands',
  imports: [ButtonComponent],
  templateUrl: './tenant-commands.component.html',
  styleUrl: './tenant-commands.component.scss',
})
export class TenantCommandsComponent {
  constructor(
    private confirmationService: ConfirmationService,
    private snackbarService: SnackbarService
  ) {}

  handleReloadCacheClicked(): void {
    this.confirmationService.confirmAndExecute(() => this.reloadDataCache(), {
      title: 'Reload Data Cache',
      message: 'Are you sure you want to reload the data cache of this tenant?',
    });
  }

  reloadDataCache(): void {
    this.snackbarService.show(`Data Cache reloaded.`, 'Close', 3000, 'success');
  }
}
