import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

/**
 * SnackbarService displays temporary snack-bar notifications to users.
 *
 * Supported Types:
 * - success: Primary colorer (blue) notification for success messages.
 * - error: Warning colored (red) notification for error messages.
 * - info: Default colored (gray) notification for general messages.
 *
 * Example Usage:
 * snackbarService.show(
              'Backend is back online.',
              'Close',
              4000,
              'success'
            );
 */

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Displays a snackbar notification.
   *
   * @param message The message text to display
   * @param action Optional action label (default: 'Close')
   * @param duration Duration in milliseconds before auto-dismiss (default: 3000)
   * @param type Type of message: 'success' | 'error' | 'info' (default: 'info')
   * @returns Observable that emits when the snackbar is dismissed
   */
  show(
    message: string,
    action = 'Close',
    duration = 3000,
    type: 'success' | 'error' | 'info' = 'info'
  ): Observable<MatSnackBarDismiss> {
    const snackBarRef = this.snackBar.open(message, action, {
      duration: duration,
      panelClass: [`snackbar-${type}`],
    });

    return snackBarRef.afterDismissed();
  }
}
