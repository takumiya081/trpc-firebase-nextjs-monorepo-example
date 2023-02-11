import type {User} from 'firebase/auth';

export interface AuthUser {
  // TODO:  firebase userに依存してるので修正する
  user: User;
  // TODO: role決まったら修正する
  claims: {
    admin?: boolean;
  };
}
