import { makeSchema } from "@nexus/schema";
import path from 'path'
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema'
import { GraphQLServer } from "graphql-yoga";
import * as Prisma from '@prisma/client'
import Mutation from './src/graphql/mutations'
import Query from './src/graphql/queries'
import Comment from './src/graphql/models/Comment'
import Invite from './src/graphql/models/Invite'
import Label from './src/graphql/models/Label'
import Organization from './src/graphql/models/Organization'
import ResponseRequest from './src/graphql/models/ResponseRequest'
import Task from './src/graphql/models/Task'
import Team from './src/graphql/models/Team'
import User from './src/graphql/models/User'

const prisma = new Prisma.PrismaClient()

const schema = makeSchema({
  // shouldExitAfterGenerateArtifacts: true,
  typegenAutoConfig: {
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
    ],
},
  types: [
    Query,
    Mutation,
    Comment,
    Invite,
    Label,
    Organization,
    ResponseRequest,
    Task,
    Team,
    User
  ],
  plugins: [nexusSchemaPrisma({
    experimentalCRUD: true
  })],
  outputs: {
    typegen: path.join(__dirname, 'node_modules/@types/nexus-typegen/index.d.ts'),
    schema: path.join(__dirname, './api.graphql')
  },
});

const server = new GraphQLServer({
  schema,
  context: ctx => ({ ...ctx, prisma }),
});

server.start({
    port: 8001,
  }, () => console.log(`running on ${8001}`))