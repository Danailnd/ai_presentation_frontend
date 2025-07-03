import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationOptions } from '../../../core/models/confirmation.options';

@Component({
  selector: 'app-combined-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent<T = unknown> implements OnInit {
  form!: FormGroup;
  showErrors = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA)
    public data: ConfirmationOptions<T>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        userInput: ['', Validators.required],
        ticketId: [''],
        reason: [''],
      },
      {
        validators: [
          this.confirmationTextValidator(),
          this.ticketIdOrReasonRequiredValidator(),
          this.ticketIdValidator(),
          this.reasonValidator(),
        ],
      }
    );
  }

  get requiresValidation(): boolean {
    return !!(
      this.data.requiredText ||
      this.data.ticketIdEnabled ||
      this.data.reasonEnabled
    );
  }

  confirmationTextValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (!this.data.requiredText) return null;
      const input = group.get('userInput')?.value?.trim().toLowerCase() ?? '';
      const required = this.data.requiredText.trim().toLowerCase();
      if (!input) return null;
      return input === required ? null : { confirmationTextMismatch: true };
    };
  }

  ticketIdOrReasonRequiredValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (!this.data.ticketIdEnabled && !this.data.reasonEnabled) return null;
      const ticket = group.get('ticketId')?.value?.trim() || '';
      const reason = group.get('reason')?.value?.trim() || '';
      return ticket || reason ? null : { ticketIdOrReasonMissing: true };
    };
  }

  ticketIdDigitsOnlyValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const ticket = group.get('ticketId')?.value?.trim() || '';
      return ticket && !/^[0-9]+$/.test(ticket)
        ? { ticketIdInvalid: true }
        : null;
    };
  }
  ticketIdValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const ticket = group.get('ticketId')?.value?.trim();
      if (!ticket) return null;
      if (!/^\d+$/.test(ticket)) {
        return { ticketIdNotDigits: true };
      }
      if (ticket.length !== 10) {
        return { ticketIdWrongLength: true };
      }
      return null;
    };
  }

  reasonValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const reason = group.get('reason')?.value?.trim();
      if (!reason) return null;
      return reason.length >= 6 ? null : { reasonTooShort: true };
    };
  }

  get hasChanges(): boolean {
    return Array.isArray(this.data.changes) && this.data.changes.length > 0;
  }

  // Error flags
  get isUserInputEmpty(): boolean {
    return this.form.get('userInput')?.hasError('required') ?? false;
  }

  get isUserInputWrong(): boolean {
    return this.form.errors?.['confirmationTextMismatch'] ?? false;
  }

  get isTicketIdOrReasonMissing(): boolean {
    return this.form.errors?.['ticketIdOrReasonMissing'] ?? false;
  }

  get isTicketIdInvalid(): boolean {
    return this.form.errors?.['ticketIdInvalid'] ?? false;
  }

  get isTicketIdNotDigits(): boolean {
    return this.form.errors?.['ticketIdNotDigits'] ?? false;
  }

  get isTicketIdWrongLength(): boolean {
    return this.form.errors?.['ticketIdWrongLength'] ?? false;
  }

  get isReasonTooShort(): boolean {
    return this.form.errors?.['reasonTooShort'] ?? false;
  }

  onConfirm(): void {
    this.showErrors = true;

    if (this.requiresValidation) {
      if (this.form.invalid) return;

      if (this.isTicketIdOrReasonMissing) return;

      if (this.isUserInputWrong) return;
    }

    this.dialogRef.close({
      confirmed: true,
      reason: this.form.get('reason')?.value,
      ticketId: this.form.get('ticketId')?.value,
    });
  }

  onCancel(): void {
    this.dialogRef.close({ confirmed: false });
  }
}
