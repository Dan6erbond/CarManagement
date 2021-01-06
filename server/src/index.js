import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import knex from "knex";
import { schema } from "./graphql/schema";
import dbConfig from "./knex/knexfile";

dotenv.config();

const db = knex(dbConfig[process.env.NODE_ENV]);

const PORT = process.env.PORT | 4000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const server = new ApolloServer({
  schema,
  context: (_, connection) => {
    if (connection) {
      // check connection for metadata
      return connection.context;
    }

    return { db };
  },
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
