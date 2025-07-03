import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Tenant } from '../../../../../../core/models/tenant.model';
import { BreakpointService } from '../../../../../../core/services/breakpoint.service';
import { CopyToClipboardComponent } from '../../../../../shared/copy-to-clipboard/copy-to-clipboard.component';

@Component({
  selector: 'app-tenant-overview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatTooltipModule,
    CopyToClipboardComponent,
  ],
  templateUrl: './tenant-overview.component.html',
  styleUrls: ['./tenant-overview.component.scss'],
})
export class TenantOverviewComponent implements OnInit {
  // -------------------------------
  // 🔹 Initalization
  // -------------------------------
  @Input() tenant: Tenant | null = null;
  @Input() originalTenant: Tenant | null = null;
  @Input() disabled = false;
  @Output() changed = new EventEmitter<Partial<Tenant>>();

  isPhoneView = false;

  constructor(private breakpointService: BreakpointService) {}

  ngOnInit(): void {
    this.breakpointService.isPhoneView$.subscribe((isPhone) => {
      this.isPhoneView = isPhone;
    });
  }

  // -------------------------------
  // 🔹 Event Emitters
  // -------------------------------
  emitState(): void {
    if (!this.tenant) return;

    this.changed.emit({
      name: this.tenant.name,
      blocked: this.tenant.blocked,
      mailReaderStopping: this.tenant.mailReaderStopping,
      externalReporting: this.tenant.externalReporting,
      googleDocAIEnabled: this.tenant.googleDocAIEnabled,
      googleTranslationEnabled: this.tenant.googleTranslationEnabled,
      masterDataCacheEnabled: this.tenant.masterDataCacheEnabled,
    });
  }

  // -------------------------------
  // 🔹 Getters/Setters
  // -------------------------------
  get isUnblocked(): boolean {
    return !this.tenant?.blocked;
  }
  set isUnblocked(value: boolean) {
    if (this.tenant) {
      this.tenant.blocked = !value;
      this.emitState();
    }
  }

  get isNotStopped(): boolean {
    return !this.tenant?.mailReaderStopping;
  }
  set isNotStopped(value: boolean) {
    if (this.tenant) {
      this.tenant.mailReaderStopping = !value;
      this.emitState();
    }
  }

  get isExternalReporting(): boolean {
    return this.tenant?.externalReporting ?? false;
  }
  set isExternalReporting(value: boolean) {
    if (this.tenant) {
      this.tenant.externalReporting = value;
      this.emitState();
    }
  }

  get isDocAIEnabled(): boolean {
    return this.tenant?.googleDocAIEnabled ?? false;
  }
  set isDocAIEnabled(value: boolean) {
    if (this.tenant) {
      this.tenant.googleDocAIEnabled = value;
      this.emitState();
    }
  }

  get isTranslationEnabled(): boolean {
    return this.tenant?.googleTranslationEnabled ?? false;
  }
  set isTranslationEnabled(value: boolean) {
    if (this.tenant) {
      this.tenant.googleTranslationEnabled = value;
      this.emitState();
    }
  }

  get isCacheEnabled(): boolean {
    return this.tenant?.masterDataCacheEnabled ?? false;
  }
  set isCacheEnabled(value: boolean) {
    if (this.tenant) {
      this.tenant.masterDataCacheEnabled = value;
      this.emitState();
    }
  }

  // -------------------------------
  // 🔹 Change Indicators
  // -------------------------------
  get nameChanged(): boolean {
    return this.tenant?.name !== this.originalTenant?.name;
  }

  get blockedChanged(): boolean {
    return this.tenant?.blocked !== this.originalTenant?.blocked;
  }

  get mailReaderChanged(): boolean {
    return (
      this.tenant?.mailReaderStopping !==
      this.originalTenant?.mailReaderStopping
    );
  }

  get externalReportingChanged(): boolean {
    return (
      this.tenant?.externalReporting !== this.originalTenant?.externalReporting
    );
  }

  get googleDocAIChanged(): boolean {
    return (
      this.tenant?.googleDocAIEnabled !==
      this.originalTenant?.googleDocAIEnabled
    );
  }

  get googleTranslationChanged(): boolean {
    return (
      this.tenant?.googleTranslationEnabled !==
      this.originalTenant?.googleTranslationEnabled
    );
  }

  get masterDataCacheChanged(): boolean {
    return (
      this.tenant?.masterDataCacheEnabled !==
      this.originalTenant?.masterDataCacheEnabled
    );
  }

  // -------------------------------
  // 🔹 UI Handlers
  // -------------------------------
  onTenantNameChange(): void {
    this.emitState();
  }

  onToggleChange(): void {
    this.emitState();
  }
}
