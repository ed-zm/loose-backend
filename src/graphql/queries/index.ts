import prisma from '../../prisma'
import publicResolvers from '../../publicResolvers'
import authenticate from '../../authenticate'

const Query = {}
const queryResolvers = Object.keys(prisma.query)

queryResolvers.forEach(key => {
  Query[key] = async (_, args, ctx, info) => {
    const isPublic = publicResolvers.find(p => p ===  key)
    if(isPublic) {
      return prisma.query[key](args, info)
    } else {
      const authenticated = await authenticate(ctx)
      if(authenticated) {
        return prisma.query[key](args, info)
      } else {
        throw new Error("Unauthenticated")
      }
    }
  }
})

export default Query