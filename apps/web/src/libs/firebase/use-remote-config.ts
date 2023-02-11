import {getRemoteConfig} from 'firebase/remote-config';

import {FirebaseApp} from './app';

/**
 * remote configはbrowserじゃないとエラーになるのでhookで扱う
 */
export function useRemoteConfig() {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const remoteConfig = getRemoteConfig(FirebaseApp.instance.app);

  if (process.env.NODE_ENV === 'development') {
    /**
     * 開発環境では5分間でキャッシュを更新させる
     */
    remoteConfig.settings.minimumFetchIntervalMillis = 300000;
  }

  return remoteConfig;
}
