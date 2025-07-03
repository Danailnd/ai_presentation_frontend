import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatSidenavModule,
  MatSidenav,
  MatDrawer,
} from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SharedService } from '../../../core/services/shared.service';
import { BreakpointService } from '../../../core/services/breakpoint.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer?: MatSidenav;

  isPhoneView = false;
  tenantsExpanded = false;

  @Output() toggleTheme = new EventEmitter<void>();
  @Input() isDarkMode = false;

  onToggleTheme(): void {
    this.toggleTheme.emit();
  }

  private subscription?: Subscription;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private breakpointService: BreakpointService
  ) {}

  // ----------------------------
  // 🔹 Lifecycle Hooks
  // ----------------------------
  ngOnInit(): void {
    this.subscription = this.sharedService.triggerSidebarFunction$.subscribe(
      () => this.toggleDrawer()
    );

    this.breakpointService.isPhoneView$.subscribe((isPhone) => {
      this.isPhoneView = isPhone;
    });

    if (this.router.url.startsWith('/tenants')) {
      this.tenantsExpanded = true;
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  // ----------------------------
  // 🔹 Navigation & Actions
  // ----------------------------
  navigateTo(route: string, drawer: MatDrawer): void {
    this.router.navigate([route]);
    drawer.close();
  }

  toggleDrawer(): void {
    this.drawer?.toggle();
  }

  toggleTenantsSection(): void {
    this.tenantsExpanded = !this.tenantsExpanded;
  }
}
