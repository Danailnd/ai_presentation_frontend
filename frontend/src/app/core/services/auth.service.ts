import { Injectable, Inject, OnDestroy } from '@angular/core';
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
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/** Interface representing a simplified user profile. */
interface UserProfile {
  name: string;
  email: string;
  initials: string;
}
/**
 * AuthService handles authentication via Microsoft Identity (MSAL).
 *
 * Responsibilities:
 * - Initializes MSAL redirect/popup flows
 * - Tracks login state and current user profile
 * - Emits observable profile and login state data
 * - Provides login/logout utilities
 */
@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  /** Subject used to signal teardown for subscriptions. */
  private readonly destroying$ = new Subject<void>();

  /** Internal subject tracking login display state. */
  private readonly loginDisplaySubject = new BehaviorSubject<boolean>(false);

  /** Whether the app is running in an iframe. */
  private isIframe = false;

  /** Observable representing whether a user is logged in. */
  loginDisplay$ = this.loginDisplaySubject.asObservable();

  /** Observable representing the authenticated user's profile. */
  public userProfile$: Observable<UserProfile> = of({
    name: '',
    email: '',
    initials: '??',
  });

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {
    this.initializeAuthFlow();
  }

  /**
   * Initializes authentication state and listens for redirect results
   * and MSAL interaction status to populate user profile.
   */
  private initializeAuthFlow(): void {
    this.msalService.handleRedirectObservable().subscribe((response) => {
      if (response) {
        this.msalService.instance.setActiveAccount(response.account);
      }
    });

    this.isIframe = window !== window.parent && !window.opener;

    this.msalService.instance.enableAccountStorageEvents();

    this.userProfile$ = this.msalBroadcastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      map(() => this.extractUserProfile()),
      filter((profile) => !!profile.name && !!profile.email)
    );
  }

  /**
   * Retrieves the currently active account and builds a user profile.
   * @returns UserProfile with name, email, and initials.
   */
  private extractUserProfile(): UserProfile {
    let account = this.msalService.instance.getActiveAccount();

    if (!account) {
      const allAccounts = this.msalService.instance.getAllAccounts();
      if (allAccounts.length > 0) {
        account = allAccounts[0];
        this.msalService.instance.setActiveAccount(account);
      }
    }

    const name = account?.name || 'Unknown User';
    const email = account?.username || 'no-email@domain.com';
    const names = name.trim().split(' ');
    const firstInitial = names[0]?.charAt(0).toUpperCase() || '?';
    const lastInitial =
      names.length > 1 ? names[names.length - 1]?.charAt(0).toUpperCase() : '?';

    return {
      name,
      email,
      initials: firstInitial + lastInitial,
    };
  }

  /** Initiates login via redirect flow. */
  loginRedirect(): void {
    const request = this.msalGuardConfig.authRequest as RedirectRequest;
    this.msalService.loginRedirect(request ?? {});
  }

  /** Initiates login via popup flow. */
  loginPopup(): void {
    const request = this.msalGuardConfig.authRequest as PopupRequest;
    this.msalService
      .loginPopup(request ?? {})
      .subscribe((response: AuthenticationResult) => {
        this.msalService.instance.setActiveAccount(response.account);
      });
  }

  /** Logs the user out, either with popup or redirect. */
  logout(popup = false): void {
    const activeAccount = this.msalService.instance.getActiveAccount();

    if (popup) {
      this.msalService.logoutPopup({
        mainWindowRedirectUri: '/',
        account: activeAccount,
        logoutHint: activeAccount?.username,
      });
    } else {
      this.msalService.logoutRedirect({
        postLogoutRedirectUri: '/',
        account: activeAccount,
        logoutHint: activeAccount?.username,
      });
    }
  }

  /** Returns the currently active MSAL account. */
  get activeAccount() {
    return this.msalService.instance.getActiveAccount();
  }

  /** Cleans up subscriptions on service destruction. */
  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
  }
}
