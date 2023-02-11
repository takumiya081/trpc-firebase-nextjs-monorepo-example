import {faker} from '@faker-js/faker';

import {authUserFactory} from '../../auth-user.factory';

import {getAvatarImage} from './get-avatar-image';

describe('getAvatarImage', () => {
  it('should return image when auth user have phoneURL directly', () => {
    expect.hasAssertions();

    const url = faker.image.imageUrl();
    const authUser = authUserFactory.build({user: {photoURL: url}});
    const result = getAvatarImage(authUser);
    expect(result).toBe(url);
  });

  it('should return image when auth user have phoneURL providerData', () => {
    expect.hasAssertions();

    const url = faker.image.imageUrl();
    const authUser = authUserFactory.build({
      user: {
        photoURL: null,
        providerData: [
          {
            uid: faker.datatype.uuid(),
            providerId: 'faker',
            displayName: faker.name.fullName(),
            email: faker.internet.email(),
            phoneNumber: null,
            photoURL: null,
          },
          {
            uid: faker.datatype.uuid(),
            providerId: 'faker',
            displayName: faker.name.fullName(),
            email: faker.internet.email(),
            phoneNumber: null,
            photoURL: url,
          },
        ],
      },
    });
    const result = getAvatarImage(authUser);
    expect(result).toBe(url);
  });

  it('should return undefined when auth user do not have image', () => {
    expect.hasAssertions();

    const authUser = authUserFactory.build({
      user: {
        photoURL: null,
        providerData: [
          {
            uid: faker.datatype.uuid(),
            providerId: 'faker',
            displayName: faker.name.fullName(),
            email: faker.internet.email(),
            phoneNumber: null,
            photoURL: null,
          },
        ],
      },
    });
    const result = getAvatarImage(authUser);
    expect(result).toBeUndefined();
  });
});
