import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';

import {useAuthState} from 'react-firebase-hooks/auth';

import {firebaseAuth} from '~/libs/firebase';

import type {AuthUser} from '../models/auth-user';

export interface LoadingState {
  isLoading: true;
  error: undefined;
  authUser: undefined;
}

export interface ErrorState {
  isLoading: false;
  error: Error;
  authUser: undefined;
}

export interface AuthState {
  isLoading: false;
  error: undefined;
  authUser: AuthUser;
}

export interface NoAuthState {
  isLoading: false;
  error: undefined;
  authUser: null;
}

export type AuthUserContextState = LoadingState | ErrorState | AuthState | NoAuthState;

const AuthUserContext = createContext<AuthUserContextState>({
  isLoading: true,
  error: undefined,
  authUser: undefined,
});

interface AuthUserProviderProps {
  children: React.ReactNode;
}

export const AuthUserProvider = ({children}: AuthUserProviderProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);
  const [authUser, setAuthUser] = useState<AuthUser | null>();

  const [user, loading, error] = useAuthState(firebaseAuth);

  useEffect(() => {
    if (!user) {
      setAuthUser(user);
      if (user === null) {
        setIsLoading(false);
      }
      return;
    }

    const f = async () => {
      setIsLoading(true);
      const {claims} = await user.getIdTokenResult();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAuthUser({user, claims: claims as any});
      setIsLoading(false);
    };

    f();
  }, [user]);

  const value = useMemo<AuthUserContextState>(() => {
    if (isLoading || loading) {
      return {isLoading: true};
    }
    if (error) {
      return {
        isLoading: false,
        error,
        authUser: undefined,
      };
    }
    return {
      isLoading: false,
      authUser: authUser ?? null,
    };
  }, [authUser, error, isLoading, loading]);

  return <AuthUserContext.Provider value={value}>{children}</AuthUserContext.Provider>;
};

/**
 * test用の mock provider
 * testしたいcomponentをラップすることでuseAuthenticatedUserにmock valueを指定できる
 * FIXME: userがfirebase.Userだとmockの値を渡すのめちゃつらい。。。
 */
export const MockAuthUserContextProvider = ({
  children,
  mockState,
}: {
  mockState: AuthUserContextState;
  children: React.ReactNode;
}): JSX.Element => (
  <AuthUserContext.Provider value={mockState}>{children}</AuthUserContext.Provider>
);

export function useAuthUser() {
  return useContext(AuthUserContext);
}
