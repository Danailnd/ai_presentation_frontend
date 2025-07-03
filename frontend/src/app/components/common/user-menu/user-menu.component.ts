import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  HostListener,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const MENU_WIDTH = 330;

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuComponent implements OnInit, OnDestroy {
  userName = '';
  userEmail = '';
  userInitials = '';

  menuOpen = false;
  menuTop = 0;
  menuLeft = 0;

  @ViewChild('triggerButton', { read: ElementRef }) triggerButton!: ElementRef;

  private readonly destroy$ = new Subject<void>();

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.userProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ name, email, initials }) => {
        this.userName = name;
        this.userEmail = email;
        this.userInitials = initials;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;

    if (this.menuOpen && this.triggerButton) {
      const rect = this.triggerButton.nativeElement.getBoundingClientRect();
      const spaceRight = window.innerWidth - rect.left;
      const spaceLeft = rect.right;

      this.menuLeft =
        spaceRight < MENU_WIDTH && spaceLeft >= MENU_WIDTH
          ? rect.right + window.scrollX - MENU_WIDTH
          : rect.left + window.scrollX;

      this.menuTop = rect.bottom + window.scrollY;
    }
  }

  logout(): void {
    this.authService.logout();
    this.menuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.triggerButton?.nativeElement.contains(
      event.target
    );
    if (!clickedInside) {
      this.menuOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.menuOpen = false;
  }
}
