import {render, screen} from '~/test-helpers';
import {mockRouter} from '~/test-helpers/next-router-mock';

import {authUserContextStateFactory, MockAuthUserContextProvider} from '../../contexts';
import {authUserFactory} from '../../models/auth-user.factory';

import type {ChildrenProps} from './check-admin';
import {CheckAdmin} from './check-admin';

describe('check admin', () => {
  const MockChildrenComponent = ({admin}: ChildrenProps): JSX.Element => (
    <>{admin.user.displayName}</>
  );

  const No = () => <p data-testid="not-admin-login">not admin login</p>;
  const Loading = () => <p>loading</p>;

  it('should render loading component when loading', () => {
    expect.hasAssertions();

    render(
      <MockAuthUserContextProvider
        mockState={authUserContextStateFactory.build({}, {transient: {isLoading: true}})}
      >
        <CheckAdmin loading={<Loading />} no={<No />}>
          {({admin}) => <MockChildrenComponent admin={admin} />}
        </CheckAdmin>
      </MockAuthUserContextProvider>,
    );

    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('should render no component when not login', () => {
    expect.hasAssertions();

    render(
      <MockAuthUserContextProvider mockState={authUserContextStateFactory.noLogin().build({})}>
        <CheckAdmin loading={<Loading />}>
          {({admin}) => <MockChildrenComponent admin={admin} />}
        </CheckAdmin>
      </MockAuthUserContextProvider>,
    );

    expect(mockRouter.pathname).toBe('/404');
  });

  it('should render no component when login user is not admin', () => {
    expect.hasAssertions();

    render(
      <MockAuthUserContextProvider
        mockState={authUserContextStateFactory.build({
          authUser: authUserFactory.notAdmin().build({user: {displayName: 'bob'}}),
        })}
      >
        <CheckAdmin loading={<Loading />} no={<No />}>
          {({admin}) => <MockChildrenComponent admin={admin} />}
        </CheckAdmin>
      </MockAuthUserContextProvider>,
    );

    expect(screen.getByTestId('not-admin-login')).toBeInTheDocument();
    expect(mockRouter.pathname).toBe('/404');
  });

  it('should render children component when login', () => {
    expect.hasAssertions();

    render(
      <MockAuthUserContextProvider
        mockState={authUserContextStateFactory.build(
          {authUser: authUserFactory.admin().build({user: {displayName: 'bob'}})},
          {transient: {isLogin: true}},
        )}
      >
        <CheckAdmin loading={<Loading />} no={<No />}>
          {({admin}) => <MockChildrenComponent admin={admin} />}
        </CheckAdmin>
      </MockAuthUserContextProvider>,
    );

    expect(screen.getByText('bob')).toBeInTheDocument();
  });
});
