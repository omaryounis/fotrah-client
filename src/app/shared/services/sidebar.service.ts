import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isSmallScreen: boolean = window.innerWidth < 640;
  private sidebarStateBehaviorSubject$ = new BehaviorSubject<boolean>(
    !this.isSmallScreen
  );

  sidebarState$ = this.sidebarStateBehaviorSubject$.asObservable();

  public toggleSideBar(open: boolean): void {
    this.sidebarStateBehaviorSubject$.next(open);
  }
}
