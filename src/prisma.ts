import { Prisma } from '../generated/prisma'

export default new Prisma({
    endpoint: `http://${process.env.PRISMA_HOST}:${process.env.PRISMA_PORT}/${process.env.PRISMA_SERVICE}/${process.env.STAGE}`,
    secret: process.env.secret
  })