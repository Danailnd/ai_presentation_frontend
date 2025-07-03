import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private triggerSidebarFunctionSource = new Subject<void>();
  triggerSidebarFunction$ = this.triggerSidebarFunctionSource.asObservable();
  constructor() {}

  triggerSidebarFunction() {
    this.triggerSidebarFunctionSource.next();
  }
}
