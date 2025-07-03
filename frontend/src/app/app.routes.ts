import { Route } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { HomePageComponent } from './components/common/home-page/home-page.component';
import { BackendDownPageComponent } from './components/common/backend-down-page/backend-down-page.component';

export const routes: Route[] = [
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
