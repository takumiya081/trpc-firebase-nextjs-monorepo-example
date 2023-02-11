import {GoogleAuthProvider, signInWithRedirect, signOut as firebaseSignOut} from 'firebase/auth';

import {firebaseAuth} from '~/libs/firebase';

export function useAuthControl() {
  async function signOut() {
    await firebaseSignOut(firebaseAuth);
  }

  function signInWithGoogle() {
    signInWithRedirect(firebaseAuth, new GoogleAuthProvider());
  }

  return {
    signOut,
    signInWithGoogle,
  };
}
