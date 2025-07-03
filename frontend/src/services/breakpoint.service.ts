import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private isPhoneViewSubject = new BehaviorSubject<boolean>(false);
  isPhoneView$ = this.isPhoneViewSubject.asObservable();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(map((result) => result.matches))
      .subscribe((isPhone) => {
        this.isPhoneViewSubject.next(isPhone);
      });
  }
}
