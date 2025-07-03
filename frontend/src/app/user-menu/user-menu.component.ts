import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '../../services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-menu',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent implements OnInit {
  @Input() menuOpen: boolean = false;
  @Input() toggleMenu!: () => void;

  userName: string = '';
  userEmail: string = '';
  userInitials: string = '';

  private destroy$ = new Subject<void>();

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.userProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        this.userName = profile.name;
        this.userEmail = profile.email;
        this.userInitials = profile.initials;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.authService.logout();
    if (this.toggleMenu) {
      this.toggleMenu();
    }
  }
}
