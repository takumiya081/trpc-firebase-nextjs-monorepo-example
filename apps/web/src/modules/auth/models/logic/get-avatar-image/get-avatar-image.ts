import type {AuthUser} from '../../auth-user';

export function getAvatarImage(authUser: AuthUser): string | undefined {
  if (authUser.user.photoURL) {
    return authUser.user.photoURL;
  }

  const photoURLIndex = authUser.user.providerData.findIndex(({photoURL}) => !!photoURL);
  if (photoURLIndex === -1) {
    return undefined;
  }
  return authUser.user.providerData[photoURLIndex].photoURL ?? undefined;
}
