import express from 'express';
// import session from 'express-session';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import colors from 'colors';
// import Redis from 'ioredis';
// import connectRedis from 'connect-redis';
// import path from 'path';
import User from './entity/user';
import { ApolloServer } from 'apollo-server-express';
import { buildFederationSchema } from './helpers';
// import { createConnection } from 'typeorm';
import { UserResolver } from './resolvers';

const initServer = async (): Promise<void> => {
  const PORT = 5001;
  const app = express();
  // const RedisStore = connectRedis(session);
  // const redis = new Redis(process.env.REDIS_URL);

  // await createConnection({
  //   type: 'postgres',
  //   host: process.env.DATABASE_URL,
  //   username: process.env.DATABASE_USER,
  //   password: process.env.DATABASE_PASSWORD,
  //   database: process.env.DATABASE_NAME,
  //   logging: true,
  //   synchronize: process.env.NODE_ENV !== 'production',
  //   migrations: [path.join(__dirname, './server/migrations/*')],
  //   entities: [User]
  // });

  app.set('trust proxy', 1);
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 100
    })
  );
  app.use(
    cors({
      credentials: true,
      origin:
        process.env.NODE_ENV === 'production'
          ? 'prod url'
          : 'http://localhost:3000'
    })
  );

  // app.use(
  //   session({
  //     name: 'user',
  //     secret: process.env.SESSION_SECRET as string,
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: {
  //       maxAge: 4 * 60 * 60 * 1000, // 4 hours
  //       httpOnly: true,
  //       sameSite: 'lax'
  //     },
  //     store: new RedisStore({
  //       client: redis,
  //       disableTouch: true
  //     })
  //   })
  // );

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

  app.listen({ port: PORT }, (): void => {
    console.log(
      `\n User service is now running on http://localhost:${PORT}/graphql`
    );
  });
};

initServer().catch(err =>
  console.error(colors.red(`Error User service ${err.message}`))
);
