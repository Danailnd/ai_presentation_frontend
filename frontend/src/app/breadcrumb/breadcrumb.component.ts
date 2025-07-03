import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';

import { Breadcrumb } from '../../services/breadcrumb.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  }

  ngOnInit() {
    this.breadcrumbs$ = this.breadcrumbs$.pipe(
      map((breadcrumbs) => this.modifyBreadcrumbs(breadcrumbs))
    );
  }

  private modifyBreadcrumbs(breadcrumbs: Breadcrumb[]): Breadcrumb[] {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    let updatedBreadcrumbs: Breadcrumb[];
    if (Object.keys(queryParams).length > 0) {
      updatedBreadcrumbs = breadcrumbs;
    } else {
      updatedBreadcrumbs = breadcrumbs.slice(0, -1);
    }

    if (this.router.url !== '/') {
      updatedBreadcrumbs.unshift({ label: 'Home', url: '/' });
    }

    return updatedBreadcrumbs;
  }
}
