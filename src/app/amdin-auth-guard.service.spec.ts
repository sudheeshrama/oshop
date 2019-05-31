import { TestBed } from '@angular/core/testing';

import { AmdinAuthGuardService } from './amdin-auth-guard.service';

describe('AmdinAuthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AmdinAuthGuardService = TestBed.get(AmdinAuthGuardService);
    expect(service).toBeTruthy();
  });
});
