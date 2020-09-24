import { makeSchema, decorateType } from "@nexus/schema";
import { GraphQLDate } from 'graphql-scalars'
import path from 'path'
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema'
import { GraphQLServer } from "graphql-yoga";
import * as Prisma from '@prisma/client'
import Mutation from './src/graphql/mutations'
import Query from './src/graphql/queries'
import Comment from './src/graphql/models/Comment'
import GithubCard from './src/graphql/models/GithubCard'
import GithubColumn from './src/graphql/models/GithubColumn'
import GithubIssue from './src/graphql/models/GithubIssue'
import GithubOrganization from './src/graphql/models/GithubOrganization'
import GithubProject from './src/graphql/models/GithubProject'
import GithubRepository from './src/graphql/models/GithubRepository'
import Invite from './src/graphql/models/Invite'
import Label from './src/graphql/models/Label'
import Organization from './src/graphql/models/Organization'
import ResponseRequest from './src/graphql/models/ResponseRequest'
import Task from './src/graphql/models/Task'
import Team from './src/graphql/models/Team'
import User from './src/graphql/models/User'

export const GQLDate = decorateType(GraphQLDate, {
  rootTyping: 'Date',
  asNexusMethod: 'date',
})

require('dotenv').config()

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
    GithubCard,
    GithubColumn,
    GithubIssue,
    GithubOrganization,
    GithubProject,
    GithubRepository,
    Invite,
    Label,
    Organization,
    ResponseRequest,
    Task,
    Team,
    User,
    GQLDate
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
  port: process.env.PORT,
}, () => console.log(`running on ${process.env.PORT}`))
