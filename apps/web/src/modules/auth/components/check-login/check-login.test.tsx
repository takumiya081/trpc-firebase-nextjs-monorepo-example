import {render, screen} from '~/test-helpers';

import {authUserContextStateFactory, MockAuthUserContextProvider} from '../../contexts';
import {authUserFactory} from '../../models/auth-user.factory';

import type {ChildrenProps} from './check-login';
import {CheckLogin} from './check-login';

describe('check login', () => {
  const MockChildrenComponent = ({authUser}: ChildrenProps): JSX.Element => (
    <>{authUser.user.displayName}</>
  );

  const No = () => <p>not login</p>;
  const Loading = () => <p>loading</p>;

  it('should render loading component when loading', () => {
    expect.hasAssertions();

    render(
      <MockAuthUserContextProvider
        mockState={authUserContextStateFactory.build({}, {transient: {isLoading: true}})}
      >
        <CheckLogin loading={<Loading />} no={<No />}>
          {({authUser}) => <MockChildrenComponent authUser={authUser} />}
        </CheckLogin>
      </MockAuthUserContextProvider>,
    );

    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('should render loading component when not login', () => {
    expect.hasAssertions();

    render(
      <MockAuthUserContextProvider
        mockState={authUserContextStateFactory.build({}, {transient: {isNoLogin: true}})}
      >
        <CheckLogin loading={<Loading />} no={<No />}>
          {({authUser}) => <MockChildrenComponent authUser={authUser} />}
        </CheckLogin>
      </MockAuthUserContextProvider>,
    );

    expect(screen.getByText('not login')).toBeInTheDocument();
  });

  it('should render children component when login', () => {
    expect.hasAssertions();

    render(
      <MockAuthUserContextProvider
        mockState={authUserContextStateFactory.build(
          {authUser: authUserFactory.build({user: {displayName: 'bob'}})},
          {transient: {isLogin: true}},
        )}
      >
        <CheckLogin loading={<Loading />} no={<No />}>
          {({authUser}) => <MockChildrenComponent authUser={authUser} />}
        </CheckLogin>
      </MockAuthUserContextProvider>,
    );

    expect(screen.getByText('bob')).toBeInTheDocument();
  });
});
