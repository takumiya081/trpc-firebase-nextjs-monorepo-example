import {authUserFactory} from '../../auth-user.factory';

import {isAdmin} from './is-admin';

describe('isAdmin', () => {
  it('should return true when is admin', () => {
    expect.hasAssertions();
    expect(isAdmin(authUserFactory.admin().build())).toBe(true);
  });
  it('should return false when is not admin', () => {
    expect.hasAssertions();
    expect(isAdmin(authUserFactory.notAdmin().build())).toBe(false);
  });
});
