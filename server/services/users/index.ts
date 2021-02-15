import express from 'express';
import session from 'express-session';
import colors from 'colors';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import path from 'path';
import User from './entity/user';
import { ApolloServer } from 'apollo-server-express';
import { buildFederationSchema } from '../../helpers';
import { createConnection } from 'typeorm';
import { UserResolver } from './resolvers';

export const startService = async (port: number): Promise<string> => {
  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  await createConnection({
    type: 'postgres',
    host: process.env.DATABASE_URL,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    logging: true,
    synchronize: process.env.NODE_ENV !== 'production',
    migrations: [path.join(__dirname, './server/migrations/*')],
    entities: [User]
  });

  app.use(
    session({
      name: 'user',
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 4 * 60 * 60 * 1000, // 4 hours
        httpOnly: true,
        sameSite: 'lax'
      },
      store: new RedisStore({
        client: redis,
        disableTouch: true
      })
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildFederationSchema({
      resolvers: [UserResolver],
      orphanedTypes: [User]
    }),
    playground: true,
    subscriptions: false,
    context: ({ req, res }) => ({
      req,
      res
    })
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
    path: '/graphql'
  });

  app.listen(port, (): void => {
    console.log(
      colors.green(
        `\n User service is now running on http://localhost:${port}/graphql`
      )
    );
  });

  // if we ever go live to prod, replace prod with the live site, store name in an env var
  return `http://localhost:${port}/graphql`;
};
