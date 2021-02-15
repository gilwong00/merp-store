import { specifiedDirectives } from 'graphql';
import { gql } from 'apollo-server-express';
import {
  printSchema,
  buildFederatedSchema as buildApolloFederationSchema
} from '@apollo/federation';
import { addResolversToSchema, GraphQLResolverMap } from 'apollo-graphql';
import {
  buildSchema,
  BuildSchemaOptions,
  createResolversMap
} from 'type-graphql';
import federationDirectives from '@apollo/federation/dist/directives';

const buildFederatedSchema = async (
  options: Omit<BuildSchemaOptions, 'skipCheck'>,
  referenceResolvers?: GraphQLResolverMap<any>
) => {
  const schema = await buildSchema({
    ...options,
    directives: [
      ...specifiedDirectives,
      ...federationDirectives,
      ...(options.directives || [])
    ],
    skipCheck: true
  });

  const federatedSchema = buildApolloFederationSchema({
    typeDefs: gql(printSchema(schema)),
    resolvers: createResolversMap(schema) as any
  });

  if (referenceResolvers)
    addResolversToSchema(federatedSchema, referenceResolvers);

  return federatedSchema;
};

export default buildFederatedSchema;
