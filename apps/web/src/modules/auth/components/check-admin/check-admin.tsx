import React from 'react';

import {match, P} from 'ts-pattern';

import {Redirect404} from '~/libs/redirect';

import {useAuthUser} from '../../contexts';
import type {AuthUser} from '../../models/auth-user';
import {isAdmin} from '../../models/logic/is-admin';

export type ChildrenProps = {admin: AuthUser};

type CheckAdminProps = {
  children: (props: ChildrenProps) => JSX.Element;
  no?: React.ReactNode;
  loading?: React.ReactNode;
};

export const CheckAdmin = ({
  children,
  no = <Redirect404 />,
  loading = null,
}: CheckAdminProps): JSX.Element => {
  const result = useAuthUser();
  return match(result)
    .with({isLoading: true}, () => <>{loading}</>)
    .with({error: P.not(P.nullish)}, () => <>{no}</>)
    .with({authUser: P.nullish}, () => <>{no}</>)
    .with({authUser: P.not(P.nullish)}, ({authUser}) =>
      isAdmin(authUser) ? <>{children({admin: authUser})}</> : <>{no}</>,
    )
    .exhaustive();
};
