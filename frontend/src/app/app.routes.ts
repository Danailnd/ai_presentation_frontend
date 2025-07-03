import { Route } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { TenantPageComponent } from './tenant/tenant-page/tenant-page.component';
import { HomePageComponent } from './home-page/home-page.component';

export const routes: Route[] = [
  {
    path: 'tenants',
    component: TenantPageComponent,
    canActivate: [MsalGuard],
    data: { breadcrumb: 'Tenants' },
  },
  {
    path: '',
    component: HomePageComponent,
    canActivate: [MsalGuard],
  },

  {
    path: 'test1',
    component: TenantPageComponent,
    canActivate: [MsalGuard],
    data: { breadcrumb: 'test1' },
    children: [
      {
        path: 'test2',
        component: HomePageComponent,
        canActivate: [MsalGuard],
        data: { breadcrumb: 'test2' },
      },
    ],
  },
];
