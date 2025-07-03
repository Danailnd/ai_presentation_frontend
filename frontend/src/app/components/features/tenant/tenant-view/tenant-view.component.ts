import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Tenant } from '../../../../core/models/tenant.model';
import { HttpsService } from '../../../../core/services/https.service';

import { TenantSidebarComponent } from './tenant-sidebar/tenant-sidebar.component';
import { TenantViewButtonBarComponent } from './tenant-view-button-bar/tenant-view-button-bar.component';
import { TenantContentComponent } from './tenant-content/tenant-content.component';
import { BreakpointService } from '../../../../core/services/breakpoint.service';

@Component({
  selector: 'app-tenant-view',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatProgressSpinnerModule,
    TenantSidebarComponent,
    TenantViewButtonBarComponent,
    TenantContentComponent,
  ],
  templateUrl: './tenant-view.component.html',
  styleUrls: ['./tenant-view.component.scss'],
})
export class TenantViewComponent implements OnInit, OnChanges {
  // ----------------------------
  // 🔹 Inputs / Outputs
  // ----------------------------
  @Input() tenantId = '';
  @Output() saved = new EventEmitter<void>();

  // ----------------------------
  // 🔹 Internal State
  // ----------------------------
  isPhoneView = false;
  tenant: Tenant | null = null;
  loading = false;

  selectedSection = 'Overview';

  readonly sidebarItems = [
    { label: 'Overview', icon: 'dashboard' },
    { label: 'Commands', icon: 'settings' },
  ];

  // ----------------------------
  // 🔹 Constructor
  // ----------------------------
  constructor(
    private httpsService: HttpsService,
    private route: ActivatedRoute,
    private breakpointService: BreakpointService
  ) {}

  // ----------------------------
  // 🔹 Lifecycle Hooks
  // ----------------------------
  ngOnInit(): void {
    if (this.tenantId) {
      this.fetchTenant(this.tenantId);
    } else {
      this.route.queryParams.subscribe((params) => {
        const idFromUrl = params['id'];
        if (idFromUrl) this.fetchTenant(idFromUrl);
      });
    }
    this.breakpointService.isPhoneView$.subscribe((isPhone) => {
      this.isPhoneView = isPhone;
      if (this.tenant?.id) {
        this.fetchTenant(this.tenant.id);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tenantId'] && this.tenantId) {
      this.fetchTenant(this.tenantId);
    }
  }

  // ----------------------------
  // 🔹 Methods
  // ----------------------------
  onSidebarItemClick(label: string): void {
    this.selectedSection = label;

    const sectionId = `${label.toLowerCase()}-section`;

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  onTenantSaved(): void {
    if (this.tenant?.id) {
      this.fetchTenant(this.tenant.id);
      this.saved.emit();
    }
  }

  private fetchTenant(id: string): void {
    this.loading = true;

    this.httpsService.get<Tenant>(`customers/${id}`).subscribe({
      next: (tenant) => {
        this.tenant = { ...tenant };
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch tenant:', err);
        this.loading = false;
      },
    });
  }
}
