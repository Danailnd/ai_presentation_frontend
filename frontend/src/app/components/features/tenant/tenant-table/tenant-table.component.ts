import {
  Component,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';

import { Tenant } from '../../../../core/models/tenant.model';
import { TableComponent } from '../../../shared/table/table.component';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { BreakpointService } from '../../../../core/services/breakpoint.service';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { HttpsService } from '../../../../core/services/https.service';
import { TableColumn } from '../../../../core/models/table.column';
import { tenantTableColumns } from './tenant-table-columns';
import { ConfirmationOptions } from '../../../../core/models/confirmation.options';
import { ChangeMetadata } from '../../../../core/models/change.metadata';

@Component({
  selector: 'app-tenant-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TableComponent,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule,
  ],
  templateUrl: './tenant-table.component.html',
  styleUrls: ['./tenant-table.component.scss'],
})
export class TenantTableComponent implements OnInit, AfterViewInit {
  // -------------------------------
  // 🔹 Inputs / Outputs
  // -------------------------------
  @Input() id = '';
  @Input() loading = true;
  @Input() scrollPosition = 0;
  @Output() rowClick = new EventEmitter<{
    tenant: Tenant;
    scrollPosition: number;
  }>();
  @Output() changed = new EventEmitter<void>();

  @Input()
  set tenants(value: Tenant[]) {
    this._tenants = value.map((tenant) => ({
      ...tenant,
      mailReaderStopping: !!tenant.mailReaderStopping,
      googleDocAIEnabled: !tenant.googleDocAIEnabled,
      googleTranslationEnabled: !tenant.googleTranslationEnabled,
      masterDataCacheEnabled: !tenant.masterDataCacheEnabled,
    }));
  }
  get tenants(): Tenant[] {
    return this._tenants;
  }

  // -------------------------------
  // 🔹 ViewChild
  // -------------------------------
  @ViewChild(TableComponent) tableComponent!: TableComponent<Tenant>;

  // -------------------------------
  // 🔹 State
  // -------------------------------
  private _tenants: Tenant[] = [];
  selectedRows: Set<Tenant> = new Set<Tenant>();
  isPhoneView = false;

  columns: TableColumn<Tenant>[] = tenantTableColumns;
  columnsLight: TableColumn<Tenant>[] = [{ key: 'name', label: 'Name' }];
  filterableColumns = tenantTableColumns
    .map((col) => col.key)
    .filter((key) => key !== 'name');

  // -------------------------------
  // 🔹 Lifecycle
  // -------------------------------
  constructor(
    private snackbarService: SnackbarService,
    private breakpointService: BreakpointService,
    private confirmationService: ConfirmationService,
    private httpsService: HttpsService
  ) {}

  ngOnInit(): void {
    this.breakpointService.isPhoneView$.subscribe((isPhone) => {
      this.isPhoneView = isPhone;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.tableComponent && this.scrollPosition) {
        this.tableComponent.tableContainerRef.nativeElement.scrollTop =
          this.scrollPosition;
      }
    });
  }

  // -------------------------------
  // 🔹 Table Events
  // -------------------------------
  onRowClick(selectedTenant: Tenant): void {
    const scroll = this.tableComponent?.getScrollPosition() ?? 0;
    this.rowClick.emit({ tenant: selectedTenant, scrollPosition: scroll });
  }

  onSelectedRowsChanged(selectedRows: Set<Tenant>): void {
    this.selectedRows = selectedRows;
  }

  get isAnyRowSelected(): boolean {
    return this.selectedRows.size > 0;
  }

  refreshTable(preserveSelection = false): void {
    if (!preserveSelection) {
      this.selectedRows.clear();
    }

    setTimeout(() => {
      this.changed.emit();
    });
  }
  // -------------------------------
  // 🔹 Action Handlers
  // -------------------------------
  handleBlock(): void {
    this.confirmationService.confirmAndExecute(
      (metadata) => this.performAction('customers/block', 'blocked', metadata),
      {
        title: `Block ${this.selectedRows.size} Tenant${
          this.selectedRows.size !== 1 ? 's' : ''
        }`,
        message: `Selected tenants that are already blocked will remain blocked.`,
        banner: this.generateBanner(),
        requiredText: this.generateRequiredText('BLOCK'),
        ticketIdEnabled: true,
        reasonEnabled: true,
      }
    );
  }

  handleUnblock(): void {
    this.confirmationService.confirmAndExecute(
      (metadata) =>
        this.performAction('customers/unblock', 'activated', metadata),
      {
        title: `Activate ${this.selectedRows.size} Tenant${
          this.selectedRows.size !== 1 ? 's' : ''
        }`,
        message: `Selected tenants that are already active will remain active.`,
        banner: this.generateBanner(),
        requiredText: this.generateRequiredText('ACTIVATE'),
        ticketIdEnabled: true,
        reasonEnabled: true,
      }
    );
  }

  handleStartMailReader(): void {
    this.confirmationService.confirmAndExecute(
      (metadata) =>
        this.performAction('customers/start-mail-reader', 'started', metadata),
      {
        title: `Start email reader for ${this.selectedRows.size} Tenant${
          this.selectedRows.size !== 1 ? 's' : ''
        }`,
        message: `Selected tenants with email reader already started will remain unchanged.`,
        banner: this.generateBanner(),
        requiredText: this.generateRequiredText('START MAIL READER FOR'),
        ticketIdEnabled: true,
        reasonEnabled: true,
      }
    );
  }

  handleStopMailReader(): void {
    this.confirmationService.confirmAndExecute(
      (metadata) =>
        this.performAction('customers/stop-mail-reader', 'stopped', metadata),
      {
        title: `Stop email reader for ${this.selectedRows.size} Tenant${
          this.selectedRows.size !== 1 ? 's' : ''
        }`,
        message: `Selected tenants with email reader already started will remain unchanged.`,
        banner: this.generateBanner(),
        requiredText: this.generateRequiredText('STOP MAIL READER FOR'),
        ticketIdEnabled: true,
        reasonEnabled: true,
      }
    );
  }

  // -------------------------------
  // 🔹 Action Execution
  // -------------------------------
  private performAction(
    endpoint: string,
    actionVerb: string,
    metadata?: ChangeMetadata
  ): void {
    const ids = Array.from(this.selectedRows).map((t) => t.id);

    this.httpsService.patch(endpoint, { ids }, metadata).subscribe({
      next: () => {
        this.snackbarService.show(
          `${ids.length} tenant${ids.length !== 1 ? 's' : ''} ${actionVerb}.`,
          'Close',
          3000,
          'success'
        );
        this.refreshTable(true);
      },
      error: (err) => {
        console.error(`Failed to ${actionVerb} tenants:`, err);
        this.snackbarService.show(
          `Failed to ${actionVerb} tenants.`,
          'Close',
          3000,
          'error'
        );
      },
    });
  }

  // -------------------------------
  // 🔹 Utility Methods
  // -------------------------------

  private generateRequiredText(prefix: string): string {
    const count = this.selectedRows.size;
    return `${prefix} ${count} TENANT${count !== 1 ? 'S' : ''}`;
  }

  private generateBanner(): ConfirmationOptions<Tenant>['banner'] | undefined {
    const selected = this.selectedRows.size;
    const total = this.tenants.length;

    if (selected <= 1) return undefined;

    if (selected === total) {
      return {
        text: 'You have selected all tenants. Are you sure you want to apply this action to every tenant?',
        severity: 'alert',
      };
    }

    return {
      text: 'You are performing a mass action on multiple tenants.',
      severity: 'warning',
    };
  }
}
