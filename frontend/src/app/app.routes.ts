import { Route } from '@angular/router';
import { BackendDownPageComponent } from './components/common/backend-down-page/backend-down-page.component';
import { ChatComponent } from './components/features/chat/chat.component';

export const routes: Route[] = [
  {
    path: '',
    component: ChatComponent,
  },
  {
    path: 'backend-down',
    component: BackendDownPageComponent,
  },
];
