import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TenantOverviewComponent } from './tenant-overview/tenant-overview.component';
import { TenantCommandsComponent } from './tenant-commands/tenant-commands.component';

import { Tenant } from '../../../../../core/models/tenant.model';
import { toTenantUpdateDto } from '../../../../../core/mappers/tenant.mapper';
import { ConfirmationService } from '../../../../../core/services/confirmation.service';
import { HttpsService } from '../../../../../core/services/https.service';
import { SnackbarService } from '../../../../../core/services/snackbar.service';
import { TENANT_FIELDS_METADATA } from './tenant-fields-metadata';
import { ChangeMetadata } from '../../../../../core/models/change.metadata';
import { BreakpointService } from '../../../../../core/services/breakpoint.service';

@Component({
  selector: 'app-tenant-content',
  standalone: true,
  imports: [
    CommonModule,
    MatDivider,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TenantOverviewComponent,
    TenantCommandsComponent,
  ],
  templateUrl: './tenant-content.component.html',
  styleUrls: ['./tenant-content.component.scss'],
})
export class TenantContentComponent implements OnInit {
  // -------------------------------
  // 🔹 Inputs / Outputs
  // -------------------------------
  @Input() tenant!: Tenant | null;
  @Output() saved = new EventEmitter<void>();

  // -------------------------------
  // 🔹 Internal State
  // -------------------------------
  saving = false;

  originalTenant!: Tenant;
  currentTenant!: Tenant;

  isPhoneView = false;

  // -------------------------------
  // 🔹 Lifecycle
  // -------------------------------
  constructor(
    private confirmationService: ConfirmationService,
    private httpsService: HttpsService,
    private snackbarService: SnackbarService,
    private breakpointService: BreakpointService
  ) {}

  ngOnInit(): void {
    if (this.tenant) {
      const cloned = structuredClone({
        ...this.tenant,
        syncToReports: false,
      });
      this.originalTenant = cloned;
      this.currentTenant = structuredClone(cloned);
    }

    this.breakpointService.isPhoneView$.subscribe(
      (isPhone) => (this.isPhoneView = isPhone)
    );
  }

  get hasChanges(): boolean {
    if (!this.originalTenant || !this.currentTenant) return false;
    return (
      JSON.stringify(this.originalTenant) !== JSON.stringify(this.currentTenant)
    );
  }

  // -------------------------------
  // 🔹 Methods
  // -------------------------------
  onTenantChanged(partial: Partial<Tenant>): void {
    if (!this.currentTenant) return;

    this.currentTenant = { ...this.currentTenant, ...partial };
  }

  async confirmSave(): Promise<void> {
    const changes = this.getChangedFields();

    if (changes.length === 0) {
      this.saveChanges();
      return;
    }

    const tenantName = this.originalTenant?.name?.trim() ?? 'Tenant';
    const requiredText = `Update ${tenantName}`;

    await this.confirmationService.confirmAndExecute(
      (metadata) => this.saveChanges(metadata),
      {
        title: 'Confirm Save',
        message: 'The following changes will be saved:',
        requiredText,
        changes,
        ticketIdEnabled: true,
        reasonEnabled: true,
      }
    );
  }

  async cancelChanges(): Promise<void> {
    await this.confirmationService.confirmAndExecute(
      () => this.resetChanges(),
      {
        title: 'Cancel Changes',
        message: 'Are you sure you want to cancel your changes?',
      }
    );
  }

  private getChangedFields(): {
    field: string;
    oldValue: string;
    newValue: string;
  }[] {
    if (!this.originalTenant || !this.currentTenant) return [];

    const changes: {
      field: string;
      oldValue: string;
      newValue: string;
    }[] = [];

    for (const key of Object.keys(this.originalTenant) as (keyof Tenant)[]) {
      const originalValue = this.originalTenant[key];
      const currentValue = this.currentTenant[key];

      if (JSON.stringify(originalValue) !== JSON.stringify(currentValue)) {
        const meta = TENANT_FIELDS_METADATA[key];
        const label = meta?.label || (key as string);
        const format =
          (meta?.format as (val: Tenant[typeof key]) => string) ??
          ((v: unknown) => String(v));

        changes.push({
          field: label,
          oldValue: format(originalValue),
          newValue: format(currentValue),
        });
      }
    }

    return changes;
  }

  private saveChanges(metadata?: ChangeMetadata): void {
    if (!this.currentTenant?.id) {
      console.error('Tenant ID missing!');
      return;
    }

    const patchBody = toTenantUpdateDto(
      this.originalTenant,
      this.currentTenant
    );
    if (Object.keys(patchBody).length === 0) return;

    this.saving = true;

    this.httpsService
      .patch<Tenant>(`customers/${this.currentTenant.id}`, patchBody, metadata)
      .subscribe({
        next: (updatedTenant) => {
          const merged = {
            ...this.tenant,
            ...updatedTenant,
          };

          const cloned = structuredClone(merged);

          this.originalTenant = cloned;
          this.currentTenant = cloned;
          this.tenant = cloned;

          this.saved.emit();
          this.saving = false;

          this.snackbarService.show(
            'Tenant saved successfully.',
            'Close',
            3000,
            'success'
          );
        },
        error: (err) => {
          console.error('Error saving tenant:', err);
          this.saving = false;
          this.snackbarService.show(
            'An error occurred. Tenant was not saved.',
            'Close',
            3000,
            'error'
          );
        },
      });
  }

  private resetChanges(): void {
    this.tenant = structuredClone(this.originalTenant);
    this.currentTenant = structuredClone(this.originalTenant);
  }
}
