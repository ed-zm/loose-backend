import { schema } from 'nexus'
import { PrismaClient } from '@prisma/client'


schema.addToContext(() => {
  return {
    prisma: PrismaClient,
  }
})