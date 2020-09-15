import { settings, use } from 'nexus'
import { prisma } from 'nexus-plugin-prisma'
import * as Prisma from '@prisma/client'

export type Comment = Prisma.Comment
export type Invite = Prisma.Invite
export type Label = Prisma.Label
export type Organization = Prisma.Organization
export type Task = Prisma.Task
export type Team = Prisma.Team
export type User = Prisma.User

use(
  prisma({
    migrations: false,
    features: { crud: true },
  }),
)
settings.change({
  server: {
    startMessage: (info) => {
      settings.original.server.startMessage(info)
    },
  },
  schema: {
    generateGraphQLSDLFile: './src/generated/nexus.graphql'
  }
})