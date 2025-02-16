import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { motionGuard2Guard } from './motion-guard2.guard';

describe('motionGuard2Guard', () => {
  const executeGuard: CanDeactivateFn<unknown> = (...guardParameters) => 
      TestBed.runInInjectionContext(() => motionGuard2Guard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
