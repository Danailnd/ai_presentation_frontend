import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  PRIMARY_OUTLET,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

/**
 * Represents a breadcrumb item with a label and URL.
 */
export interface Breadcrumb {
  label: string;
  url: string;
}

/**
 * BreadcrumbService provides reactive breadcrumbs for routing in the application.
 *
 * Responsibilities:
 * - Listens to route changes via Angular Router
 * - Extracts breadcrumbs from route data (via `data.breadcrumb`)
 * - Emits a breadcrumb array through a public observable
 */
@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  /** Internal subject to hold the breadcrumb trail. */
  private readonly breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);

  /** Observable stream of breadcrumb data. */
  public readonly breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const breadcrumbs = this.buildBreadcrumbs(
          this.router.routerState.snapshot.root
        );
        this.breadcrumbsSubject.next(breadcrumbs);
      });
  }

  /**
   * Recursively constructs breadcrumb items based on route snapshot.
   * @param route Current route snapshot
   * @param url Base URL from parent
   * @returns Breadcrumb array
   */
  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url = ''
  ): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [];

    const routeURL = route.url.map((segment) => segment.path).join('/');
    if (routeURL) {
      url += `/${routeURL}`;
    }

    const label = route.data['breadcrumb'];
    if (label !== undefined && label !== null) {
      breadcrumbs.push({ label, url });
    }

    for (const child of route.children) {
      if (child.outlet === PRIMARY_OUTLET) {
        breadcrumbs.push(...this.buildBreadcrumbs(child, url));
      }
    }

    return breadcrumbs;
  }
}
