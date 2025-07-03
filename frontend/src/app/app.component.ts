import { Component, Renderer2, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';
import { ToolbarComponent } from './components/common/toolbar/toolbar.component';
import { Observable } from 'rxjs';

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
export class AppComponent implements OnInit {
  isIframe = false;
  isDarkMode = false;
  loginDisplay$!: Observable<boolean>;
  //test auto-deployment

  constructor(private renderer: Renderer2) {}

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
}
