import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { canVisitLoginGuard } from './can-visit-login.guard';

describe('canVisitLoginGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => canVisitLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
