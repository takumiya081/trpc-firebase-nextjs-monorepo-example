import {initializeApp, getApp, getApps} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';

console.log('FIREBASE_AUTH_EMULATOR_HOST', process.env.FIREBASE_AUTH_EMULATOR_HOST)

if(getApps().length === 0 ){
  initializeApp({
    projectId: 'monorepo-2022',
  })
}

/**
 * firebase app
 */
export const auth = getAuth();
