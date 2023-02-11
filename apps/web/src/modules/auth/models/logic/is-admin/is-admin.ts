import type {AuthUser} from '../../auth-user';

export function isAdmin(authUser: AuthUser) {
  return authUser.claims.admin === true;
}
