import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar'; // Import MatSnackBarDismiss
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  show(
    message: string,
    action: string = 'Close',
    duration: number = 3000,
    type: 'success' | 'error' | 'info' = 'info'
  ): Observable<MatSnackBarDismiss> {
    const snackBarRef = this.snackBar.open(message, action, {
      duration: duration,
      panelClass: [`snackbar-${type}`],
    });

    return snackBarRef.afterDismissed();
  }
}
