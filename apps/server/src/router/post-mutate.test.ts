import {MongoContext} from '~/test-helpers';
import {expect, beforeAll, describe, afterAll, test} from 'vitest'

import {postRouter} from './post'
import { inferProcedureInput } from '@trpc/server';
import { AppRouter } from '..';
import {ObjectId} from 'bson'

describe('public module query', () => {
  const mongoContext = new MongoContext();
  const savedPost = {
    id: new ObjectId().toHexString(),
    title: 'test',
    content: 'test'
  }

  beforeAll(async () => {
    await mongoContext.before();

    await mongoContext.prismaClient.post.createMany({data: [
      savedPost
    ]})
  });

  afterAll(async () => {
    await mongoContext.after();
  });

  test('should success on create when authed', async () => {
    expect.hasAssertions();
    const caller = postRouter.createCaller({prisma: mongoContext.prismaClient, user: {id: 'foo'} as any})


    const input: inferProcedureInput<AppRouter['post']['create']> = {
      title: 'test title',
      content: 'test content',
    };

    const res = await caller.create(input);
    expect(res).toMatchSnapshot({id: expect.any(String)});
  })

  test('should success on update when authed', async () => {
    expect.hasAssertions();
    const caller = postRouter.createCaller({prisma: mongoContext.prismaClient, user: {id: 'foo'} as any})


    const input: inferProcedureInput<AppRouter['post']['update']> = {
      id: savedPost.id,
      title: 'updated title',
      content: 'updated content',
    };

    const res = await caller.update(input);
    expect(res).toMatchSnapshot({id: expect.any(String)}, 'res');
  })
});