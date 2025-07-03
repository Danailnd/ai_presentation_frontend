import { Component, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { msalProviders } from './auth.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule,
    MatIconModule,
    SidebarComponent,
    ToolbarComponent,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Angular Standalone Sample - MSAL Angular';
  isIframe = false;
  isDarkMode = false;
  loginDisplay$!: Observable<boolean>;

  constructor(private renderer: Renderer2, public authService: AuthService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = localStorage.getItem('theme');

      if (storedTheme === 'dark') {
        this.isDarkMode = true;
        this.renderer.addClass(document.body, 'dark-theme');
      } else {
        this.isDarkMode = false;
        this.renderer.removeClass(document.body, 'dark-theme');
      }
    }
    this.loginDisplay$ = this.authService.loginDisplay$;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const bodyElement = document.body;

    if (this.isDarkMode) {
      this.renderer.addClass(bodyElement, 'dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(bodyElement, 'dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }
  loginRedirect() {
    this.authService.loginRedirect();
  }

  loginPopup() {
    this.authService.loginPopup();
  }

  logout(popup?: boolean) {
    this.authService.logout(popup);
  }

  ngOnDestroy(): void {}
}
