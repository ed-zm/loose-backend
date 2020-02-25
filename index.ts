import { makePrismaSchema } from "nexus-prisma";
import * as path from 'path'
import { GraphQLServer } from "graphql-yoga";
import { prisma } from "./generated/prisma-client";
import datamodelInfo from "./generated/nexus-prisma/datamodel-info";
import Mutation from './src/graphql/mutations'
import Query from './src/graphql/queries'

const schema = makePrismaSchema({
  types: [Query, Mutation],
  prisma: {
    client: prisma,
    datamodelInfo,
  },
  outputs: {
    schema: path.join(__dirname, "./generated/prisma-client/prisma.graphql"),
    typegen: path.join(__dirname, "./generated/nexus-prisma/nexus-prisma/nexus-prisma.ts")
  },
});

const server = new GraphQLServer({
  schema,
  context: { prisma },
});

server.start({
    port: process.env.PORT,
  }, () => console.log(`running on ${process.env.PORT}`))
