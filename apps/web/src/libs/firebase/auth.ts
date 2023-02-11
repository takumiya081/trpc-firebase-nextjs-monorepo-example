import {connectAuthEmulator, getAuth} from 'firebase/auth';

import {FirebaseApp} from './app';

export const firebaseAuth = getAuth(FirebaseApp.instance.app);

if (process.env.NODE_ENV !== 'production') {
  connectAuthEmulator(firebaseAuth, 'http://localhost:9099/', {disableWarnings: true});
}
