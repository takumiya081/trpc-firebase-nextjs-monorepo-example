/* eslint-disable no-underscore-dangle */
import type {FirebaseApp as FirebaseAppType} from 'firebase/app';
import {getApp, getApps, initializeApp} from 'firebase/app';

import {config} from './config';

export class FirebaseApp {
  private static selfInstance: FirebaseApp;

  private firebaseApp: FirebaseAppType;

  private constructor() {
    if (!getApps().length) {
      this.firebaseApp = initializeApp(config.development);
    } else {
      this.firebaseApp = getApp();
    }
  }

  public static get instance() {
    if (!this.selfInstance) {
      this.selfInstance = new FirebaseApp();
    }
    return this.selfInstance;
  }

  public get app() {
    return this.firebaseApp;
  }
}
