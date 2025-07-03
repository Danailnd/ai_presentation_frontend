import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Provides a reactive way to detect if the current screen size
 * is elidgible for phone view mdoe.
 *
 * Usage:
 * Subscribe to `isPhoneView$` to adapt UI behavior based on screen size.
 */
@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  /**
   * Internal subject that holds the current handset (phone) view status.
   */
  private readonly isPhoneViewSubject = new BehaviorSubject<boolean>(false);

  /**
   * Observable that emits `true` if the screen size matches a handset layout.
   * Can be used to conditionally adjust layout or behavior for mobile users.
   */
  readonly isPhoneView$ = this.isPhoneViewSubject.asObservable();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(map((result) => result.matches))
      .subscribe((isPhone) => {
        this.isPhoneViewSubject.next(isPhone);
      });
  }
}
