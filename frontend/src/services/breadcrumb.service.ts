import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  PRIMARY_OUTLET,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
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

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = ''
  ): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [];

    const routeURL = route.url.map((segment) => segment.path).join('/');
    if (routeURL) {
      url += `/${routeURL}`;
    }

    const label = route.data['breadcrumb'];
    if (label) {
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
