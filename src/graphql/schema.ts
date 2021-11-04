import { join } from "path";
import { DocumentNode, GraphQLSchema, print } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";

const types: any = loadFilesSync(join(__dirname, "./typedefs/"), {
  extensions: ["graphql"],
  recursive: true,
});

const resolvers: any = loadFilesSync(join(__dirname, "./resolvers/"), {
  extensions: ["js"],
  recursive: true,
});

const mergedTypes: DocumentNode = mergeTypeDefs(types);

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: print(mergedTypes),
  resolvers: resolvers,
});

export default schema;
