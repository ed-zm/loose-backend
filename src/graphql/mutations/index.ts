import prisma from '../../prisma'
import signIn from './signIn'
import signUp from './signUp'
import publicResolvers from '../../publicResolvers'
import authenticate from '../../authenticate'

const Mutation = {
  signIn,
  signUp
}
const mutationResolvers = Object.keys(prisma.mutation)

mutationResolvers.forEach(key => {
  Mutation[key] = async (_, args, ctx, info) => {
    const isPublic = publicResolvers.find(p => p === key)
    if(isPublic) {
      return prisma.mutation[key](args, info)
    } else {
      const authenticated = await authenticate(ctx)
      if(authenticated) {
        return prisma.mutation[key](args, info)
      } else {
        throw new Error("Unauthenticated")
      }
    }
  }
})

export default Mutation