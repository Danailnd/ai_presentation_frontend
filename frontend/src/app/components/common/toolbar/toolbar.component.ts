import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { SharedService } from '../../../core/services/shared.service';
import { AuthService } from '../../../core/services/auth.service';

import { Observable } from 'rxjs';
import { UserMenuComponent } from '../user-menu/user-menu.component';
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
    UserMenuComponent,
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
    public authService: AuthService,
    private router: Router,
    private breakpointService: BreakpointService
  ) {}

  ngOnInit(): void {
    this.loginDisplay$ = this.authService.loginDisplay$;

    this.authService.loginDisplay$.subscribe((loggedIn) => {
      if (loggedIn) this.setUserDetails();
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.updateAppNameVisibility());

    this.breakpointService.isPhoneView$.subscribe((isPhone) => {
      this.isPhoneView = isPhone;
      this.updateAppNameVisibility();
    });
  }

  private setUserDetails(): void {
    const account = this.authService.activeAccount;
    this.userName = account?.name || '';
    this.userEmail = account?.username || '';

    const names = this.userName.split(' ');
    const firstInitial = names[0]?.[0]?.toUpperCase() ?? '?';
    const lastInitial =
      names.length > 1 ? names[names.length - 1]?.[0]?.toUpperCase() : '?';

    this.userInitials = firstInitial + lastInitial;
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

  loginRedirect(): void {
    this.authService.loginRedirect();
  }

  logout(popup?: boolean): void {
    this.authService.logout(popup);
  }

  redirectToHome() {
    this.router.navigate(['/']);
  }
}
