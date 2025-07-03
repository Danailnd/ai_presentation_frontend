import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';

import { BreakpointService } from '../../../services/breakpoint.service';
import { Tenant } from '../tenant.model';
import { TenantTableComponent } from '../tenant.table/tenant.table.component';
import { DefaultPaperComponent } from '../../../shared/default.paper/default.paper.component';
import { TenantSidebarComponent } from '../tenant-sidebar/tenant-sidebar.component';
import { TenantContentOverviewComponent } from '../tenant-content-overview/tenant-content-overview.component';

import { DUMMY_TENANTS } from '../dummy-tenants';

@Component({
  selector: 'app-tenant-page',
  imports: [
    CommonModule,
    TenantTableComponent,
    DefaultPaperComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TenantSidebarComponent,
    MatSidenavModule,
    TenantContentOverviewComponent,
  ],
  templateUrl: './tenant-page.component.html',
  styleUrl: './tenant-page.component.scss',
})
export class TenantPageComponent {
  isPhoneView: boolean = false;
  id: string = '';
  isTableVisible: boolean = true;
  tenants: Tenant[] = [];
  loading: boolean = true;
  scrollPosition: number = 0;
  selectedSidebarItem: string = '';
  selectedTenant: Tenant | null = null;

  dummyTenants = DUMMY_TENANTS;

  constructor(
    private breakpointService: BreakpointService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  onSidebarItemClick(item: string) {
    this.selectedSidebarItem = item;
  }

  ngOnInit(): void {
    this.breakpointService.isPhoneView$.subscribe((isPhone) => {
      this.isPhoneView = isPhone;
    });

    this.route.queryParams.subscribe((params) => {
      this.id = params['id'] || '';

      if (!this.id) {
        this.closeSidePanel();
      }
    });
    this.fetchTenants();
  }

  fetchTenants(): void {
    setTimeout(() => {
      this.tenants = this.dummyTenants;
      this.loading = false;
    }, 750);
  }

  closeSidePanel(): void {
    this.id = '';
  }

  onTenantSelected(tenant: Tenant, scrollPosition: number): void {
    this.scrollPosition = scrollPosition;

    this.selectedTenant = tenant;

    this.isTableVisible = true;
    if (this.id !== tenant.id) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { id: tenant.id },
        queryParamsHandling: 'merge',
      });
      this.id = tenant.id || '';
    }
  }

  onExpandToggle() {
    this.isTableVisible = !this.isTableVisible;
  }
}
