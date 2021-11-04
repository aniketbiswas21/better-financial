import { ApolloServer } from "apollo-server-express";
import express from "express";
import http from "http";

import schema from "./graphql/schema";
import excelRoutes from "./routes/excel";

async function startApolloServer() {
  const app = express();
  app.use(excelRoutes);

  const graphqlServer = new ApolloServer({
    schema,
  });
  await graphqlServer.start();
  graphqlServer.applyMiddleware({ app, path: "/graphql" });
  const httpServer = http.createServer(app);

  return httpServer;
}

export default startApolloServer;
