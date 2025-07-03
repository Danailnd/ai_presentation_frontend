import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @ViewChild(`drawer`) drawer: MatSidenav | undefined;
  private subscription: Subscription | undefined;
  showFiller = false;

  constructor(private router: Router, private sharedService: SharedService) {}

  ngOnInit() {
    this.subscription = this.sharedService.triggerSidebarFunction$.subscribe(
      () => {
        this.toggleDrawer();
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  navigateTo(route: string, drawer: any): void {
    this.router.navigate([route]);
    drawer.close();
  }

  toggleDrawer() {
    this.drawer?.toggle();
  }
}
