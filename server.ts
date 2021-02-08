import 'dotenv-safe/config';
import express from 'express';
// import rateLimit from 'express-rate-limit';
// import cors from 'cors';
import colors from 'colors';
import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway } from '@apollo/gateway';

const initGateway = async (): Promise<void> => {
  const PORT = process.env.PORT || 5000;
  const app = express();

  // app.set('trust proxy', 1);
  // app.use(
  //   rateLimit({
  //     windowMs: 1 * 60 * 1000,
  //     max: 100
  //   })
  // );
  // app.use(
  //   cors({
  //     credentials: true,
  //     origin:
  //       process.env.NODE_ENV === 'production'
  //         ? 'prod url'
  //         : 'http://localhost:3000'
  //   })
  // );

  const createGateway = () =>
    new Promise(resolve => {
      const gateway = new ApolloGateway({
        serviceList: [{ name: 'user', url: 'http://localhost:5001/graphql' }]
      });

      setTimeout(() => resolve(gateway), 5000);
    });

  const apolloServer = new ApolloServer({
    gateway: (await createGateway()) as ApolloGateway,
    subscriptions: false,
    playground: true
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
    path: '/graphql'
  });

  app.listen({ port: PORT }, (): void => {
    console.log(
      `\n🚀  Gateway is now running on http://localhost:${PORT}/graphql`
    );
  });
};

initGateway().catch(err =>
  console.error(colors.red(`Error starting server ${err.message}`))
);
