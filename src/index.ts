import app from "./app";

const server = app();

server.then((app) =>
  app.listen(4000, () => {
    console.log(
      "GraphQL Server is now running on http://localhost:4000/graphql"
    );
  })
);
