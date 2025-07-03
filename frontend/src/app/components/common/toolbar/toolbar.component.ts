import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { SharedService } from '../../../core/services/shared.service';

import { Observable } from 'rxjs';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { BreakpointService } from '../../../core/services/breakpoint.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    BreadcrumbComponent,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit {
  @ViewChild('menuButton') menuButton?: ElementRef<HTMLButtonElement>;

  isPhoneView = false;
  showAppName = false;

  loginDisplay$!: Observable<boolean>;
  userName = '';
  userEmail = '';
  userInitials = '';
  menuOpen = false;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private breakpointService: BreakpointService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.updateAppNameVisibility());

    this.breakpointService.isPhoneView$.subscribe((isPhone) => {
      this.isPhoneView = isPhone;
      this.updateAppNameVisibility();
    });
  }

  private updateAppNameVisibility(): void {
    const isHome = this.router.url === '/' || this.router.url === '/index';
    this.showAppName = this.isPhoneView && isHome;
  }

  toggleUserMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  onToggleSidebar(): void {
    this.sharedService.triggerSidebarFunction();
  }

  redirectToHome() {
    this.router.navigate(['/']);
  }
}
