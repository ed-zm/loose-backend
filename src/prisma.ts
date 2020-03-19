import { Prisma } from '../generated/prisma-client'

export default new Prisma({
    endpoint: `${process.env.PRISMA_HOST}:${process.env.PRISMA_PORT}/${process.env.PRISMA_SERVICE}/${process.env.STAGE}`,
    secret: process.env.PRISMA_SECRET
  })
