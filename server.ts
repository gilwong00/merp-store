import 'dotenv-safe/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import colors from 'colors';
import path from 'path';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './server/graphql';
import { User, Product, OrderDetail, OrderHeader } from './server/entities';

const initServer = async (): Promise<void> => {
  const PORT = process.env.PORT || 5000;
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
    entities: [User, Product, OrderDetail, OrderHeader]
  });

  app.set('trust proxy', 1);
  app.use(
    cors({
      credentials: true,
      origin:
        process.env.NODE_ENV === 'production'
          ? 'prod url'
          : 'http://localhost:3000'
    })
  );

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
    schema: await buildSchema({
      resolvers: [UserResolver]
    }),
    playground: true,
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
      `\n🚀  GraphQL is now running on http://localhost:${PORT}/graphql`
    );
  });
};

initServer().catch(err =>
  console.error(colors.red(`Error starting server ${err.message}`))
);
