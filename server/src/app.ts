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
import passport from 'passport';
import MongoStore from 'connect-mongo';
import './utils/passport';
import session from 'express-session';
import authRouter from './routes/auth';
import userRouter from './routes/user';

dotenv.config();

const port = process.env.PORT || 5000;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

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

  await server.start();

  await connectDB();

  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: 'secret',
      cookie: {
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
      store: MongoStore.create({
        mongoUrl: process.env.DB_URI,
        collectionName: 'sessions',
        stringify: false,
        autoRemove: 'interval',
        autoRemoveInterval: 1,
      }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.get('/', (req, res) => {
    res.send('Pig & Anchovy');
  });
  app.use('/graphql', expressMiddleware(server));

  app.use('/auth', authRouter);
  app.use(
    '/user',
    passport.authenticate('jwt', { session: false }),
    userRouter
  );

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`Server ready at http://localhost:${process.env.PORT}/graphql`);
};

startApolloServer();
