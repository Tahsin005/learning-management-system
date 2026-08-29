/** @import { Core } from '@strapi/strapi' */

const path = require('path');
const { isDatabaseClientKind } = require('@strapi/database');
const parsePg = require('pg-connection-string').parse;

module.exports = ({ env }) => {
  const dbUrl = env('DATABASE_URL');
  const defaultClient = dbUrl && dbUrl.startsWith('postgres') ? 'postgres' : 'sqlite';
  const client = env('DATABASE_CLIENT', defaultClient);

  if (!isDatabaseClientKind(client)) {
    throw new Error(
      `Unsupported DATABASE_CLIENT: ${client}. Use "postgres", "mysql", or "sqlite".`
    );
  }

  let postgresConnection = {
    host: env('DATABASE_HOST', 'localhost'),
    port: env.int('DATABASE_PORT', 5432),
    database: env('DATABASE_NAME', 'strapi'),
    user: env('DATABASE_USERNAME', 'strapi'),
    password: env('DATABASE_PASSWORD', 'strapi'),
    ssl: env.bool('DATABASE_SSL', false)
      ? {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
        }
      : false,
    schema: env('DATABASE_SCHEMA', 'public'),
  };

  if (dbUrl && client === 'postgres') {
    const parsed = parsePg(dbUrl);
    postgresConnection = {
      host: parsed.host || env('DATABASE_HOST', 'localhost'),
      port: parsed.port ? parseInt(parsed.port, 10) : env.int('DATABASE_PORT', 5432),
      database: parsed.database || env('DATABASE_NAME', 'strapi'),
      user: parsed.user || env('DATABASE_USERNAME', 'strapi'),
      password: parsed.password || env('DATABASE_PASSWORD', 'strapi'),
      ssl: {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
      },
      schema: env('DATABASE_SCHEMA', 'public'),
    };
  }

  /** @type {Record<Core.Config.Database.ClientKind, Core.Config.Database['connection']>} */
  const connections = {
    mysql: {
      client: 'mysql',
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    postgres: {
      client: 'postgres',
      connection: postgresConnection,
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    sqlite: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
