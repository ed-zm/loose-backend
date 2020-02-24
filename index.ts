import { prismaObjectType, makePrismaSchema } from "nexus-prisma";
import * as path from 'path'
// import { idArg } from "nexus";
import { GraphQLServer } from "graphql-yoga";
import { prisma } from "./generated/prisma-client";
import datamodelInfo from "./generated/nexus-prisma/datamodel-info";

const Query = prismaObjectType({
  name: "Query",
  definition: (t) => t.prismaFields(["*"]),
});

const Mutation = prismaObjectType({
  name: "Mutation",
  definition(t) {
    t.prismaFields(["createTask"]);
    // t.field("markAsDone", {
    //   type: "Todo",
    //   args: { id: idArg() },
    //   nullable: true,
    //   resolve: (_, { id }, ctx) => {
    //     return ctx.prisma.updateTodo({
    //       where: { id },
    //       data: { done: true },
    //     });
    //   },
    // });
  },
});

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
