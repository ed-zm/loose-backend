import { Prisma } from '../generated/prisma-client'

export default new Prisma({
    // endpoint: `https://${process.env.PRISMA_HOST}/prisma`,
    // endpoint: process.env.NODE_ENV === 'production' ?
    // `https://${process.env.PRISMA_HOST}/prisma` :
    `${process.env.PRISMA_HOST}:${process.env.PRISMA_PORT}/${process.env.PRISMA_SERVICE}/${process.env.STAGE}`,
    secret: process.env.PRISMA_SECRET
  })
