import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  isSmallScreen: boolean = window.innerWidth < 640;
  constructor() { }

  isScreenBelowThan(size: number): boolean {
    return window.innerWidth <= size;
  }
}
