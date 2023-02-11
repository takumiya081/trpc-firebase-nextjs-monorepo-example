import {PrismaClient} from '@prisma/client';
import {execSync} from 'child_process';
import fs from 'fs';
import path from 'path';

export function createTestPrismaClient(databaseUrl: string) {
  return new PrismaClient({datasources: {db: {url: databaseUrl}}});
}

function generateDatabaseName() {
  const r = Math.random().toString(36).slice(2, 7);
  return r;
}

function getPrismaBinary() {
  let currDir = __dirname;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const binaryPath = path.join(currDir, 'node_modules/.bin/prisma');
    if (fs.existsSync(binaryPath)) {
      return binaryPath;
    }
    const {dir, root} = path.parse(currDir);
    if (dir === root) {
      throw new Error(
        `Could not find prisma binary in the parent directories starting from ${__dirname}.`,
      );
    }
    currDir = dir;
  }
}

function getPrismaSchemaPath() {
  let currDir = __dirname;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const binaryPath = path.join(currDir, 'prisma/schema.prisma');
    if (fs.existsSync(binaryPath)) {
      return binaryPath;
    }
    const {dir, root} = path.parse(currDir);
    if (dir === root) {
      throw new Error(
        `Could not find prisma/schema.prisma in the parent directories starting from ${__dirname}.`,
      );
    }
    currDir = dir;
  }
}

function createTestDatabaseUrl(dbName: string) {
  // url format like `mongodb://root:password@localhost:27018/tests?authSource=admin`
  const query = process.env.DATABASE_URL.match(/\?.+/gi);
  return process.env.DATABASE_URL.replace(
    /^(mongodb:\/\/.+\/).+(\?.*)?$/gi,
    `$1${dbName}${query ? query[0] : ''}`,
  );
}

export async function testSetUp() {
  const databaseName = generateDatabaseName();
  const databaseUrl = createTestDatabaseUrl(databaseName);

  const prismaBinary = getPrismaBinary();
  const prismaSchemaPath = getPrismaSchemaPath();
  execSync(`${prismaBinary} db push --skip-generate --schema ${prismaSchemaPath}`, {
    env: {...process.env, DATABASE_URL: databaseUrl},
  });

  const prismaClientInstance = new PrismaClient({datasources: {db: {url: databaseUrl}}});

  async function clear() {
    await prismaClientInstance.$disconnect();
  }

  return {
    prisma: prismaClientInstance,
    databaseUrl,
    databaseName,
    clear,
  };
}
