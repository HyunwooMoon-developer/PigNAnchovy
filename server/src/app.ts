import express, { Application } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import connectDB from './utils/connectDB';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './gql/typeDef';
import resolvers from './gql/resolvers';

dotenv.config();

const port = process.env.PORT || 5000;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

const startApolloServer = async () => {
  const app: Application = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageLocalDefault(),
    ],
  });

  await connectDB();

  await server.start();

  app.use('/graphql', expressMiddleware(server));

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`Server ready at http://localhost:${process.env.PORT}/graphql`);
};

startApolloServer();
