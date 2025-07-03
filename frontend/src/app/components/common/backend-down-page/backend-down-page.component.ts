import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DefaultPaperComponent } from '../../shared/default.paper/default.paper.component';
import { BreakpointService } from '../../../core/services/breakpoint.service';
import { HttpsService } from '../../../core/services/https.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-backend-down-page',
  standalone: true,
  imports: [
    CommonModule,
    DefaultPaperComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './backend-down-page.component.html',
  styleUrls: ['./backend-down-page.component.scss'],
})
export class BackendDownPageComponent implements OnInit {
  isPhoneView = false;

  constructor(
    private breakpointService: BreakpointService,
    private httpsService: HttpsService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.breakpointService.isPhoneView$.subscribe(
      (isPhone) => (this.isPhoneView = isPhone)
    );

    this.checkBackendStatus();
  }

  checkBackendStatus(): void {
    this.httpsService.get<{ status: string }>('core/status').subscribe({
      next: (res) => {
        if (res?.status === 'ok') {
          this.router.navigate(['/']).then(() => {
            this.snackbarService.show(
              'Backend is back online.',
              'Close',
              4000,
              'success'
            );
          });
        }
      },
      error: (err) => {
        this.snackbarService.show('Backend is down.', 'Close', 3000, 'error');
        console.warn('Backend still down:', err);
      },
    });
  }
}
