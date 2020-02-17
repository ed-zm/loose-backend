import prisma from '../../prisma'
import signIn from './signIn'
import signUp from './signUp'

const Mutation = {
  signIn,
  signUp
}
const mutationResolvers = Object.keys(prisma.mutation)

mutationResolvers.forEach(key => {
  Mutation[key] = (_, args, ctx, info) => prisma.mutation[key](args, info)
})

export default Mutation