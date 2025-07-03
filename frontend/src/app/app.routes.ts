import { Route } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { TenantMainPageComponent } from './components/features/tenant/tenant-main-page/tenant-main-page.component';
import { HomePageComponent } from './components/common/home-page/home-page.component';
import { BackendDownPageComponent } from './components/common/backend-down-page/backend-down-page.component';
import { TenantCreationPageComponent } from './components/features/tenant/tenant-creation-page/tenant-creation-page.component';
import { TenantIndexComponent } from './components/features/tenant/tenant-index/tenant-index.component';

export const routes: Route[] = [
  {
    path: 'tenants',
    component: TenantIndexComponent,
    canActivate: [MsalGuard],
    data: { breadcrumb: 'Tenants' },

    children: [
      {
        path: '',
        component: TenantMainPageComponent,
        canActivate: [MsalGuard],
        data: { breadcrumb: null },
      },
      {
        path: 'create',
        component: TenantCreationPageComponent,
        canActivate: [MsalGuard],
        data: { breadcrumb: 'Create' },
      },
    ],
  },
  {
    path: '',
    component: HomePageComponent,
    canActivate: [MsalGuard],
  },
  {
    path: 'backend-down',
    component: BackendDownPageComponent,
    canActivate: [MsalGuard],
  },
];
