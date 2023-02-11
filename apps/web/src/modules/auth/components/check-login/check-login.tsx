import React from 'react';

import {match, P} from 'ts-pattern';

import {useAuthUser} from '../../contexts';
import type {AuthUser} from '../../models/auth-user';

export type ChildrenProps = {authUser: AuthUser};

type CheckLoginProps = {
  children: (props: ChildrenProps) => JSX.Element;
  no?: React.ReactNode;
  loading?: React.ReactNode;
};

export const CheckLogin = ({children, no = null, loading = null}: CheckLoginProps): JSX.Element => {
  const result = useAuthUser();
  return match(result)
    .with({isLoading: true}, () => <>{loading}</>)
    .with({error: P.not(P.nullish)}, () => <>{no}</>)
    .with({authUser: P.nullish}, () => <>{no}</>)
    .with({authUser: P.not(P.nullish)}, ({authUser}) => <>{children({authUser})}</>)
    .exhaustive();
};
