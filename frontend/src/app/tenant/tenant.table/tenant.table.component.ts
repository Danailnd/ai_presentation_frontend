import {
  Component,
  EventEmitter,
  Output,
  Input,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Tenant } from '../tenant.model';
import { TableComponent } from '../../../shared/table/table.component';

@Component({
  selector: 'app-tenant-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TableComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './tenant.table.component.html',
  styleUrl: './tenant.table.component.scss',
  standalone: true,
})
export class TenantTableComponent {
  @Output() rowClick = new EventEmitter<{
    tenant: Tenant;
    scrollPosition: number;
  }>();
  @Input() id: any = null;
  @Input() tenants: Tenant[] = [];
  @Input() loading: boolean = true;
  @ViewChild(TableComponent) tableComponent!: TableComponent;
  @Input() scrollPosition: number = 0;

  columns = [
    { key: 'name', label: 'Name' },
    { key: 'domain', label: 'Domain' },
    {
      key: 'locked',
      label: 'Locked',
      customCell: (value: boolean) => (value ? 'lock' : ''),
    },
    {
      key: 'isActive',
      label: 'Active',
      customCell: (value: boolean) => (value ? 'check' : 'close'),
    },
    {
      key: 'creationDate',
      label: 'Creation Date',
    },
  ];
  columnsLight = [{ key: 'name', label: 'Name' }];

  constructor(private router: Router) {}

  goToAddPage(): void {
    this.router.navigate(['/add']);
  }

  onRowClick(selectedTenant: Tenant): void {
    const currentScrollPosition = this.tableComponent?.getScrollPosition() ?? 0;
    this.rowClick.emit({
      tenant: selectedTenant,
      scrollPosition: currentScrollPosition,
    });
  }
}
