import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmationOptions } from '../models/confirmation.options';
import { ConfirmationDialogComponent } from '../../components/shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationResult } from '../models/confirmation.result';
import { ChangeMetadata } from '../models/change.metadata';

/**
 * ConfirmationService centralizes the display of various types of confirmation dialogs.
 *
 * It supports:
 * - Basic yes/no dialogs
 * - Write-up/acknowledgment dialogs with required text
 * - Change summary dialogs showing field-level modifications
 *
 * Usage:
 * - Call `confirm()` to show a dialog and get a boolean result
 * - Call `confirmAndExecute()` to only execute an action if confirmed
 */

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private readonly dialog = inject(MatDialog);

  /**
   * Opens a confirmation dialog based on the given type and returns a boolean result.
   *
   * @param options Optional configuration object to customize dialog content and type.
   * @returns A Promise that resolves to true if confirmed, false otherwise.
   */
  confirm<T = unknown>(
    options?: ConfirmationOptions<T>
  ): Promise<ConfirmationResult> {
    const dialogConfig = {
      width: options?.width ?? '800px',
      maxWidth: options?.maxWidth ?? '90vw',
      autoFocus: false,
      data: {
        title: options?.title ?? 'Confirm Action',
        message: options?.message ?? '',
        requiredText: options?.requiredText,
        changes: options?.changes ?? [],
        banner: options?.banner,
        ticketIdEnabled: options?.ticketIdEnabled,
        reasonEnabled: options?.reasonEnabled,
      },
    };

    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      dialogConfig
    );

    return firstValueFrom(dialogRef.afterClosed()).then((result) => ({
      confirmed: result?.confirmed === true,
      reason: result?.reason,
      ticketId: result?.ticketId,
    }));
  }

  /**
   * Displays a confirmation dialog and runs the given action only if the user confirms.
   *
   * @param action Function to execute if confirmed.
   * @param options Optional configuration for the confirmation dialog.
   */
  async confirmAndExecute<T = unknown>(
    action: (metadata?: { reason?: string; ticketId?: string }) => void,
    options?: ConfirmationOptions<T>
  ): Promise<void> {
    const result = await this.confirm<T>(options);
    if (result.confirmed) {
      const metadata: ChangeMetadata = {
        reason: result.reason ?? '',
        ticketId: result.ticketId ?? '',
      };
      action(metadata);
    }
  }
}
