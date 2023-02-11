import {MongoContext} from '~/test-helpers';
import {expect, beforeAll, describe, afterAll, test} from 'vitest'

import {postRouter} from './post'
import { inferProcedureInput } from '@trpc/server';
import { AppRouter } from '..';
import {ObjectId} from 'bson'

describe('create post module', () => {
  const mongoContext = new MongoContext();
  beforeAll(async () => {
    await mongoContext.before();
  });

  afterAll(async () => {
    await mongoContext.after();
  });

  test('should get response', async () => {
    expect.hasAssertions();
    const caller = postRouter.createCaller({prisma: mongoContext.prismaClient, user: undefined})

    const post = {
      id: new ObjectId().toHexString(),
      title: 'test',
      content: 'test'
    }

    await mongoContext.prismaClient.post.createMany({data: [
      post
    ]})

    const input: inferProcedureInput<AppRouter['post']['byId']> = {
      id: post.id
    };

    const res = await caller.byId(input);
    expect(res).toMatchSnapshot({id: expect.any('string')});
  })
});