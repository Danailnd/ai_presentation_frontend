import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedService } from '../../services/shared.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-toolbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    UserMenuComponent,
    MatTooltipModule,
    BreadcrumbComponent,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit {
  @Input() isDarkMode: boolean = false;
  @Output() toggleTheme: EventEmitter<void> = new EventEmitter();
  @ViewChild('menuButton') menuButton: any;
  loginDisplay$!: Observable<boolean>;

  userName: string = '';
  userEmail: string = '';
  userInitials: string = '';
  menuOpen = false;

  constructor(
    private sharedService: SharedService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginDisplay$ = this.authService.loginDisplay$;

    this.authService.loginDisplay$.subscribe((loggedIn) => {
      if (loggedIn) {
        const account = this.authService.activeAccount;
        this.userName = account?.name || '';
        this.userEmail = account?.username || '';
        const names = this.userName.split(' ');
        const firstNameInitial = names[0]?.charAt(0).toUpperCase() || '?';
        const lastNameInitial =
          names.length > 1
            ? names[names.length - 1]?.charAt(0).toUpperCase()
            : '?';

        this.userInitials = firstNameInitial + lastNameInitial;
      }
    });
  }

  toggleUserMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onToggleTheme() {
    this.toggleTheme.emit();
  }

  onToggleSidebar() {
    this.sharedService.triggerSidebarFunction();
  }

  loginRedirect() {
    this.authService.loginRedirect();
  }

  logout(popup?: boolean) {
    this.authService.logout(popup);
  }
}
