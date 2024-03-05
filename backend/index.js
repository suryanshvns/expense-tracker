import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from "dotenv"

import passport from 'passport';
import session from 'express-session';
import connectMongo from "connect-mongodb-session"

import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { buildContext } from "graphql-passport";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

import { connectDB } from './database/connectDb.js';
import passportConfig from './passport/passport.config.js';

dotenv.config();
passportConfig();

const app = express();
 
const httpServer = http.createServer(app);

const MongoDbStore = connectMongo(session);
const store = new MongoDbStore({
  uri: process.env.MONGO_URI,
  collection: "sessions"
});

store.on("error", (err) => console.log(err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
    store: store
  })
)

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  //cors: { credentials: true }
});

await server.start();
app.use(cors({origin:true,credentials: true}));
app.use(
  '/graphql',
  express.json(),
  expressMiddleware(server, {
    context: async ({ req,res }) => buildContext({ req,res }),
  }),
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();

console.log(`🚀 Server ready at http://localhost:4000/graphql`);
