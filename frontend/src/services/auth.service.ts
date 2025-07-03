import { Injectable, Inject } from '@angular/core';
import {
  MsalService,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
} from '@azure/msal-angular';
import {
  AuthenticationResult,
  InteractionStatus,
  PopupRequest,
  RedirectRequest,
} from '@azure/msal-browser';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _destroying$ = new Subject<void>();
  private loginDisplaySubject = new BehaviorSubject<boolean>(false);

  isIframe = false;
  loginDisplay$ = this.loginDisplaySubject.asObservable();

  public userProfile$: Observable<{
    name: string;
    email: string;
    initials: string;
  }> = of({ name: '', email: '', initials: '??' });

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {
    this.initAuth();
  }

  private initAuth() {
    this.authService.handleRedirectObservable().subscribe((response) => {
      if (response) {
        this.authService.instance.setActiveAccount(response.account);
      }
    });

    this.isIframe = window !== window.parent && !window.opener;

    this.authService.instance.enableAccountStorageEvents();

    this.userProfile$ = this.msalBroadcastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      map(() => {
        let account = this.authService.instance.getActiveAccount();

        if (!account) {
          const allAccounts = this.authService.instance.getAllAccounts();
          if (allAccounts.length > 0) {
            account = allAccounts[0];
            this.authService.instance.setActiveAccount(account);
          }
        }

        const name = account?.name || 'Unknown User';
        const email = account?.username || 'no-email@domain.com';

        const names = name.trim().split(' ');
        const firstInitial = names[0]?.charAt(0).toUpperCase() || '?';
        const lastInitial =
          names.length > 1
            ? names[names.length - 1]?.charAt(0).toUpperCase()
            : '?';

        const profile = {
          name,
          email,
          initials: firstInitial + lastInitial,
        };
        return profile;
      }),
      filter((profile) => !!profile.name && !!profile.email)
    );
  }

  loginRedirect() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }

  loginPopup() {
    if (this.msalGuardConfig.authRequest) {
      this.authService
        .loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
    } else {
      this.authService
        .loginPopup()
        .subscribe((response: AuthenticationResult) => {
          this.authService.instance.setActiveAccount(response.account);
        });
    }
  }

  logout(popup?: boolean) {
    if (popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: '/',
      });
    } else {
      this.authService.logoutRedirect();
    }
  }

  get activeAccount() {
    return this.authService.instance.getActiveAccount();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
