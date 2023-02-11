import {MongoClient} from 'mongodb';

import type {PrismaClient} from '@packages/db';
import {testSetUp} from '@packages/db';

export class MongoContext {
  private databaseName?: string;

  private databaseUrl?: string;

  private prismaClientInstance: undefined | PrismaClient = undefined;

  private clear?: () => Promise<void>;

  public get prismaClient(): PrismaClient {
    if (this.prismaClientInstance === undefined) {
      throw new Error('prismaClient is undefined');
    }
    return this.prismaClientInstance;
  }

  public async before() {
    try {
      const testHelpers = await testSetUp();
      this.databaseName = testHelpers.databaseName;
      this.databaseUrl = testHelpers.databaseUrl;
      this.prismaClientInstance = testHelpers.prisma;
      this.clear = testHelpers.clear;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`error on push`, e);
    }
  }

  public async after() {
    try {
      if (!this.databaseUrl) {
        throw new Error(`this.databaseUrl is undefined`);
      }
      const client = await new MongoClient(this.databaseUrl).connect();
      await client.db(this.databaseName).dropDatabase();
      await client.close();
      await this.clear?.();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('delete db error', e);
    }
  }
}
