import prisma from '../../prisma'

const Query = {}
const queryResolvers = Object.keys(prisma.query)

queryResolvers.forEach(key => {
  Query[key] = (_, args, ctx, info) => prisma.query[key](args, info)
})

export default Query