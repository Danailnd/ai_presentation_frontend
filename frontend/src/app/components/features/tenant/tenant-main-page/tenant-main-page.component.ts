import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { BreakpointService } from '../../../../core/services/breakpoint.service';
import { Tenant } from '../../../../core/models/tenant.model';
import { TenantTableComponent } from '../tenant-table/tenant-table.component';
import { DefaultPaperComponent } from '../../../shared/default.paper/default.paper.component';
import { TenantViewComponent } from '../tenant-view/tenant-view.component';
import { HttpsService } from '../../../../core/services/https.service';
import { downloadCSV } from '../../../../core/download-as-csv';
import { ConfirmationService } from '../../../../core/services/confirmation.service';

@Component({
  selector: 'app-tenant-main-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSidenavModule,
    MatProgressSpinner,
    TenantTableComponent,
    DefaultPaperComponent,
    TenantViewComponent,
  ],
  templateUrl: './tenant-main-page.component.html',
  styleUrls: ['./tenant-main-page.component.scss'],
})
export class TenantMainPageComponent implements OnInit {
  // --------------------------------
  // 🔸 Public properties (state)
  // --------------------------------
  isPhoneView = false;
  id = '';
  isTableVisible = true;
  tenants: Tenant[] = [];
  loading = true;
  scrollPosition = 0;
  selectedTenant: Tenant | null = null;
  isExporting = false;

  // --------------------------------
  // 🔸 Constructor (dependencies)
  // --------------------------------
  constructor(
    private breakpointService: BreakpointService,
    private route: ActivatedRoute,
    private router: Router,
    private httpsService: HttpsService,
    private confirmationService: ConfirmationService
  ) {}

  // --------------------------------
  // 🔸 Lifecycle Hooks
  // --------------------------------
  ngOnInit(): void {
    this.listenToBreakpointChanges();
    this.listenToRouteParams();
    this.fetchTenants();
  }

  // --------------------------------
  // 🔸 Event Handlers
  // --------------------------------
  onTenantSelected(tenant: Tenant, scrollPosition: number): void {
    this.scrollPosition = scrollPosition;
    this.selectedTenant = tenant;

    if (this.id !== tenant.id) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { id: tenant.id },
        queryParamsHandling: 'merge',
      });
      this.id = tenant.id || '';
    }
  }

  onExpandToggle(): void {
    this.isTableVisible = !this.isTableVisible;
  }

  goToTenantCreationPage(): void {
    this.router.navigate(['/tenants/create']);
  }

  handleExportToCSV(): void {
    this.confirmationService.confirmAndExecute(() => this.exportToCSV(), {
      title: 'Export to CSV',
      message: 'Export the data from this table to a csv file?',
    });
  }

  // --------------------------------
  // 🔸 Internal Logic
  // --------------------------------
  private listenToBreakpointChanges(): void {
    this.breakpointService.isPhoneView$.subscribe((isPhone) => {
      this.isPhoneView = isPhone;
    });
  }

  private listenToRouteParams(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'] || '';
      if (!this.id) this.closeSidePanel();
    });
  }

  fetchTenants(): void {
    this.loading = true;
    this.httpsService.get<Tenant[]>('customers').subscribe({
      next: (response) => {
        this.tenants = [...response];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching tenants:', error);
        this.loading = false;
      },
    });
  }

  private exportToCSV(): void {
    if (this.isExporting) return;
    this.isExporting = true;
    this.httpsService.get<Tenant[]>('customers').subscribe({
      next: (response) => {
        downloadCSV(response, 'tenants.csv', ';');
        this.isExporting = false;
      },
      error: (error) => {
        console.error('Error exporting tenants:', error);
        this.isExporting = false;
      },
    });
  }

  private closeSidePanel(): void {
    this.id = '';
    this.selectedTenant = null;
  }
}
