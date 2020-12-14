import { MiddlewareFn } from 'type-graphql';
import { AuthenticationError } from 'apollo-server-express';
import { Context } from '../types';

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  if (!context.req.session.userId)
    throw new AuthenticationError('Not Authenticated');

  return next();
};
